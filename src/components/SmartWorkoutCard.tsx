import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  TrendingUp, 
  Zap, 
  Target,
  Brain,
  Calendar,
  ChevronRight
} from "lucide-react";
import { UserData } from "@/components/OnboardingFlow";
import { aiService, WorkoutFeedback, AIRecommendation } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface SmartWorkoutCardProps {
  workout: {
    name: string;
    duration: string;
    exercises: string[];
    difficulty?: number; // 1-10 scale
    aiGenerated?: boolean;
  };
  userData: UserData;
  onWorkoutComplete?: (feedback: WorkoutFeedback) => void;
}

export const SmartWorkoutCard = ({ workout, userData, onWorkoutComplete }: SmartWorkoutCardProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    difficulty: 'just_right' as 'too_easy' | 'just_right' | 'too_hard',
    enjoyment: 5,
    completionRate: 100,
    notes: ''
  });
  const { toast } = useToast();

  const handleFeedbackSubmit = () => {
    const workoutFeedback: WorkoutFeedback = {
      workoutId: workout.name,
      difficulty: feedback.difficulty,
      enjoyment: feedback.enjoyment,
      completionRate: feedback.completionRate,
      timestamp: new Date()
    };

    aiService.addWorkoutFeedback(workoutFeedback);
    onWorkoutComplete?.(workoutFeedback);
    
    toast({
      title: "Feedback Recorded!",
      description: "Your workout feedback helps us personalize future recommendations.",
    });

    setShowFeedback(false);
  };

  const difficultyColor = workout.difficulty 
    ? workout.difficulty <= 3 ? 'text-green-600' 
    : workout.difficulty <= 7 ? 'text-yellow-600' 
    : 'text-red-600'
    : 'text-gray-600';

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {workout.aiGenerated && <Brain className="h-4 w-4 text-primary" />}
              {workout.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{workout.duration}</span>
              {workout.difficulty && (
                <>
                  <span>•</span>
                  <span className={difficultyColor}>
                    Difficulty: {workout.difficulty}/10
                  </span>
                </>
              )}
              {workout.aiGenerated && (
                <Badge variant="secondary" className="ml-2">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Optimized
                </Badge>
              )}
            </CardDescription>
          </div>
          <Button 
            variant="hero" 
            size="sm"
            onClick={() => setShowFeedback(true)}
          >
            Start Workout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workout.exercises.slice(0, 4).map((exercise, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm">{exercise}</span>
              <Badge variant="outline" className="text-xs">3 sets</Badge>
            </div>
          ))}
          {workout.exercises.length > 4 && (
            <div className="text-sm text-muted-foreground text-center">
              +{workout.exercises.length - 4} more exercises
            </div>
          )}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              How was your workout?
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Difficulty Level</label>
                <div className="flex gap-2 mt-1">
                  {(['too_easy', 'just_right', 'too_hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={feedback.difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedback(prev => ({ ...prev, difficulty: level }))}
                    >
                      {level === 'too_easy' ? 'Too Easy' : 
                       level === 'just_right' ? 'Perfect' : 'Too Hard'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Enjoyment (1-5 stars)</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeedback(prev => ({ ...prev, enjoyment: star }))}
                    >
                      <Star 
                        className={`h-4 w-4 ${star <= feedback.enjoyment ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Completion Rate</label>
                <div className="mt-2">
                  <Progress value={feedback.completionRate} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="font-medium">{feedback.completionRate}%</span>
                    <span>100%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={feedback.completionRate}
                    onChange={(e) => setFeedback(prev => ({ ...prev, completionRate: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFeedbackSubmit} size="sm">
                  Submit Feedback
                </Button>
                <Button variant="outline" onClick={() => setShowFeedback(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AIRecommendationsCardProps {
  recommendations: AIRecommendation[];
  userData: UserData;
}

export const AIRecommendationsCard = ({ recommendations, userData }: AIRecommendationsCardProps) => {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-blue-200 bg-blue-50'
  };

  const priorityIcons = {
    high: <TrendingUp className="h-4 w-4 text-red-600" />,
    medium: <Target className="h-4 w-4 text-yellow-600" />,
    low: <Brain className="h-4 w-4 text-blue-600" />
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Your personalized suggestions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Complete a few workouts to get personalized AI recommendations!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Personalized suggestions based on your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-3">
              {priorityIcons[rec.priority]}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(rec.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                {rec.actionable && (
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                    Take Action <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
