import { UserData } from "@/components/OnboardingFlow";

export interface WorkoutFeedback {
  workoutId: string;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  enjoyment: number; // 1-5 scale
  completionRate: number; // 0-100%
  timestamp: Date;
}

export interface MealFeedback {
  mealId: string;
  rating: number; // 1-5 scale
  liked: boolean;
  tooSalty?: boolean;
  tooSpicy?: boolean;
  tooSweet?: boolean;
  timestamp: Date;
}

export interface ProgressData {
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
  workoutPerformance?: {
    strength: number; // relative improvement
    endurance: number; // relative improvement
    consistency: number; // percentage
  };
  date: Date;
}

export interface AIRecommendation {
  type: 'workout_adjustment' | 'meal_suggestion' | 'motivation' | 'recovery';
  title: string;
  description: string;
  confidence: number; // 0-1
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

class AIService {
  private workoutFeedback: WorkoutFeedback[] = [];
  private mealFeedback: MealFeedback[] = [];
  private progressHistory: ProgressData[] = [];

  // Store feedback for learning
  addWorkoutFeedback(feedback: WorkoutFeedback) {
    this.workoutFeedback.push(feedback);
    this.saveToLocalStorage('workoutFeedback', this.workoutFeedback);
  }

  addMealFeedback(feedback: MealFeedback) {
    this.mealFeedback.push(feedback);
    this.saveToLocalStorage('mealFeedback', this.mealFeedback);
  }

  addProgressData(progress: ProgressData) {
    this.progressHistory.push(progress);
    this.saveToLocalStorage('progressHistory', this.progressHistory);
  }

  // Load data from localStorage
  loadStoredData() {
    this.workoutFeedback = this.loadFromLocalStorage('workoutFeedback') || [];
    this.mealFeedback = this.loadFromLocalStorage('mealFeedback') || [];
    this.progressHistory = this.loadFromLocalStorage('progressHistory') || [];
  }

  // Adaptive workout difficulty
  getWorkoutDifficultyAdjustment(userData: UserData): number {
    if (this.workoutFeedback.length < 3) return 1.0; // No adjustment for new users

    const recentFeedback = this.workoutFeedback.slice(-5); // Last 5 workouts
    const avgDifficulty = recentFeedback.reduce((sum, feedback) => {
      const difficultyScore = feedback.difficulty === 'too_easy' ? 0.3 : 
                             feedback.difficulty === 'just_right' ? 0.6 : 0.9;
      return sum + difficultyScore;
    }, 0) / recentFeedback.length;

    const avgCompletion = recentFeedback.reduce((sum, feedback) => 
      sum + feedback.completionRate, 0) / recentFeedback.length / 100;

    // Adjust difficulty based on feedback
    if (avgDifficulty < 0.4 && avgCompletion > 0.8) {
      return 1.2; // Increase difficulty
    } else if (avgDifficulty > 0.8 || avgCompletion < 0.6) {
      return 0.8; // Decrease difficulty
    }
    return 1.0; // No change
  }

  // Smart meal preferences learning
  getMealPreferences(): string[] {
    if (this.mealFeedback.length < 5) return [];

    const likedMeals = this.mealFeedback.filter(feedback => feedback.liked && feedback.rating >= 4);
    const mealTypes = likedMeals.map(feedback => feedback.mealId);
    
    // Count frequency of liked meal types
    const preferences = mealTypes.reduce((acc, mealType) => {
      acc[mealType] = (acc[mealType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Return top preferences
    return Object.entries(preferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([mealType]) => mealType);
  }

  // Progress prediction
  predictProgress(userData: UserData, timeframe: number): {
    weightChange: number;
    strengthGain: number;
    enduranceImprovement: number;
    confidence: number;
  } {
    if (this.progressHistory.length < 2) {
      // Initial predictions based on user data
      const weeklyWeightChange = userData.primaryGoal === 'weight_loss' ? -0.5 : 
                                userData.primaryGoal === 'muscle_gain' ? 0.2 : 0;
      
      return {
        weightChange: weeklyWeightChange * timeframe,
        strengthGain: userData.fitnessLevel === 'beginner' ? 0.3 : 0.15,
        enduranceImprovement: userData.fitnessLevel === 'beginner' ? 0.25 : 0.1,
        confidence: 0.6
      };
    }

    // Calculate trends from progress history
    const recentProgress = this.progressHistory.slice(-8); // Last 8 entries
    const weightTrend = this.calculateTrend(recentProgress.map(p => p.weight || userData.weight));
    const strengthTrend = this.calculateTrend(
      recentProgress.map(p => p.workoutPerformance?.strength || 0)
    );

    return {
      weightChange: weightTrend * timeframe,
      strengthGain: Math.max(0, strengthTrend),
      enduranceImprovement: Math.max(0, strengthTrend * 0.8),
      confidence: Math.min(0.9, recentProgress.length / 8)
    };
  }

  // Generate contextual AI recommendations
  generateRecommendations(userData: UserData): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Workout recommendations based on feedback
    const difficultyAdjustment = this.getWorkoutDifficultyAdjustment(userData);
    if (difficultyAdjustment !== 1.0) {
      recommendations.push({
        type: 'workout_adjustment',
        title: difficultyAdjustment > 1 ? 'Increase Workout Intensity' : 'Reduce Workout Intensity',
        description: difficultyAdjustment > 1 
          ? 'Based on your recent feedback, you\'re ready for more challenging workouts!'
          : 'Let\'s adjust your workouts to match your current fitness level better.',
        confidence: 0.8,
        priority: 'medium',
        actionable: true
      });
    }

    // Meal recommendations based on preferences
    const preferences = this.getMealPreferences();
    if (preferences.length > 0) {
      recommendations.push({
        type: 'meal_suggestion',
        title: 'Personalized Meal Suggestions',
        description: `We've noticed you enjoy ${preferences.slice(0, 2).join(' and ')}. We'll prioritize similar meals in your plan.`,
        confidence: 0.75,
        priority: 'low',
        actionable: true
      });
    }

    // Progress-based motivational recommendations
    if (this.progressHistory.length > 0) {
      const latestProgress = this.progressHistory[this.progressHistory.length - 1];
      const prediction = this.predictProgress(userData, 4); // 4 weeks

      if (prediction.confidence > 0.7) {
        recommendations.push({
          type: 'motivation',
          title: 'You\'re On Track!',
          description: `Based on your progress, you could see ${Math.abs(prediction.weightChange).toFixed(1)}kg ${prediction.weightChange < 0 ? 'weight loss' : 'muscle gain'} in the next month.`,
          confidence: prediction.confidence,
          priority: 'high',
          actionable: false
        });
      }
    }

    // Recovery recommendations based on workout frequency
    const recentWorkouts = this.workoutFeedback.filter(
      f => new Date().getTime() - f.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );

    if (recentWorkouts.length > parseInt(userData.workoutFrequency?.replace('_days', '') || '3')) {
      recommendations.push({
        type: 'recovery',
        title: 'Consider a Rest Day',
        description: 'You\'ve been very consistent this week. A rest day might help optimize your recovery.',
        confidence: 0.7,
        priority: 'medium',
        actionable: true
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Enhanced AI Coach responses using OpenAI
  async generateContextualResponse(userMessage: string, userData: UserData): Promise<string> {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          userData: userData
        }
      });

      if (error) {
        console.error('Error calling AI chat function:', error);
        return this.getFallbackResponse(userMessage, userData);
      }

      return data.response || this.getFallbackResponse(userMessage, userData);
    } catch (error) {
      console.error('Error in generateContextualResponse:', error);
      return this.getFallbackResponse(userMessage, userData);
    }
  }

  // Fallback responses when OpenAI is not available
  private getFallbackResponse(userMessage: string, userData: UserData): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || lowerMessage.includes('unmotivated')) {
      return `Remember why you started your ${userData.primaryGoal?.replace('_', ' ')} journey. Based on your ${userData.fitnessLevel} level, you're building sustainable habits. Small consistent actions lead to big results! 💪`;
    }

    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('meal')) {
      return `For your ${userData.primaryGoal?.replace('_', ' ')} goal, focus on ${userData.primaryGoal === 'weight_loss' ? 'a slight calorie deficit with high protein' : userData.primaryGoal === 'muscle_gain' ? 'adequate calories and protein timing around workouts' : 'balanced nutrition to maintain your current physique'}.`;
    }

    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('training')) {
      return `Your ${userData.fitnessLevel} level and ${userData.workoutFrequency?.replace('_', ' ')} frequency is a great foundation. Focus on consistency over perfection!`;
    }

    // Default response
    return `As your AI coach, I'm here to help with your ${userData.primaryGoal?.replace('_', ' ')} journey! How can I assist you today?`;
  }

  // Utility methods
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * (index + 1), 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private saveToLocalStorage(key: string, data: any) {
    try {
      localStorage.setItem(`fitmate_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(`fitmate_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
