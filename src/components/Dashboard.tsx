import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Target, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Utensils, 
  Pill, 
  TrendingUp,
  Settings,
  User,
  CheckCircle,
  Play
} from "lucide-react";
import { UserData } from "./OnboardingFlow";

interface DashboardProps {
  userData: UserData;
  onEditProfile: () => void;
}

const Dashboard = ({ userData, onEditProfile }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate BMI
  const bmi = userData.weight / Math.pow(userData.height / 100, 2);
  
  // Weekly progress (mock data)
  const weeklyProgress = 65;

  // Generate workout plan based on user data
  const generateWorkoutPlan = () => {
    const workouts = [];
    const frequency = parseInt(userData.workoutFrequency?.replace('_days', '') || '3');
    
    const beginnerWorkouts = [
      { name: "Full Body Strength", duration: "45 min", exercises: ["Push-ups", "Squats", "Plank", "Lunges"] },
      { name: "Cardio & Core", duration: "30 min", exercises: ["Walking", "Knee Raises", "Dead Bug", "Bird Dog"] },
      { name: "Upper Body Focus", duration: "40 min", exercises: ["Wall Push-ups", "Arm Circles", "Resistance Band Rows"] },
    ];
    
    const intermediateWorkouts = [
      { name: "Push Day", duration: "60 min", exercises: ["Bench Press", "Shoulder Press", "Dips", "Push-ups"] },
      { name: "Pull Day", duration: "60 min", exercises: ["Pull-ups", "Rows", "Lat Pulldowns", "Bicep Curls"] },
      { name: "Leg Day", duration: "75 min", exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"] },
      { name: "Cardio HIIT", duration: "45 min", exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
    ];
    
    const advancedWorkouts = [
      { name: "Heavy Compound", duration: "90 min", exercises: ["Deadlifts", "Squats", "Bench Press", "Rows"] },
      { name: "Olympic Lifts", duration: "75 min", exercises: ["Clean & Jerk", "Snatch", "Front Squats"] },
      { name: "HIIT Circuit", duration: "60 min", exercises: ["Box Jumps", "Battle Ropes", "Kettlebell Swings"] },
      { name: "Accessory Work", duration: "45 min", exercises: ["Isolation Exercises", "Core Work", "Mobility"] },
    ];
    
    let workoutPool = beginnerWorkouts;
    if (userData.fitnessLevel === 'intermediate') workoutPool = intermediateWorkouts;
    if (userData.fitnessLevel === 'advanced') workoutPool = advancedWorkouts;
    
    // Filter out exercises that might aggravate injuries
    const filteredWorkouts = workoutPool.map(workout => {
      let filteredExercises = [...workout.exercises];
      
      if (userData.injuries?.includes('Knee Pain')) {
        filteredExercises = filteredExercises.filter(ex => !ex.toLowerCase().includes('squat') && !ex.toLowerCase().includes('lunge'));
        filteredExercises.push('Leg Press (light)', 'Stationary Bike');
      }
      
      if (userData.injuries?.includes('Back Pain')) {
        filteredExercises = filteredExercises.filter(ex => !ex.toLowerCase().includes('deadlift'));
        filteredExercises.push('Cat-Cow Stretches', 'Swimming');
      }
      
      if (userData.injuries?.includes('Shoulder Issues')) {
        filteredExercises = filteredExercises.filter(ex => !ex.toLowerCase().includes('press') && !ex.toLowerCase().includes('push'));
        filteredExercises.push('Light Resistance Bands', 'Physical Therapy Exercises');
      }
      
      return { ...workout, exercises: filteredExercises };
    });
    
    return filteredWorkouts.slice(0, frequency);
  };

  // Generate nutrition plan
  const generateNutritionPlan = () => {
    const baseCalories = userData.gender === 'male' ? 2200 : 1800;
    const activityMultiplier = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'very': 1.725,
      'extra': 1.9
    }[userData.activityLevel || 'moderate'] || 1.55;
    
    const goalMultiplier = {
      'weight_loss': 0.85,
      'muscle_gain': 1.15,
      'maintenance': 1.0,
      'endurance': 1.1,
      'strength': 1.1,
      'flexibility': 1.0
    }[userData.primaryGoal || 'maintenance'] || 1.0;
    
    const totalCalories = Math.round(baseCalories * activityMultiplier * goalMultiplier);
    const protein = Math.round(userData.weight * 2.2); // 2.2g per kg for high protein
    const carbs = Math.round(totalCalories * 0.4 / 4); // 40% of calories
    const fats = Math.round(totalCalories * 0.25 / 9); // 25% of calories
    
    return {
      calories: totalCalories,
      protein: protein,
      carbs: carbs,
      fats: fats,
      meals: userData.preferredMeals || 4
    };
  };

  // Generate supplement recommendations
  const generateSupplements = () => {
    const supplements = [];
    
    // Base recommendations
    supplements.push({ name: "Whey Protein", reason: "Support muscle protein synthesis", timing: "Post-workout" });
    supplements.push({ name: "Multivitamin", reason: "Fill nutritional gaps", timing: "With breakfast" });
    
    // Goal-specific
    if (userData.primaryGoal === 'muscle_gain') {
      supplements.push({ name: "Creatine Monohydrate", reason: "Increase strength and muscle mass", timing: "Post-workout" });
      supplements.push({ name: "BCAAs", reason: "Reduce muscle breakdown", timing: "During workout" });
    }
    
    if (userData.primaryGoal === 'weight_loss') {
      supplements.push({ name: "L-Carnitine", reason: "Support fat metabolism", timing: "Pre-workout" });
      supplements.push({ name: "Green Tea Extract", reason: "Boost metabolism", timing: "Between meals" });
    }
    
    if (userData.primaryGoal === 'endurance') {
      supplements.push({ name: "Beta-Alanine", reason: "Improve muscular endurance", timing: "Pre-workout" });
      supplements.push({ name: "Electrolytes", reason: "Maintain hydration", timing: "During workout" });
    }
    
    // Injury-specific
    if (userData.injuries?.some(injury => injury.includes('Joint') || injury.includes('Arthritis'))) {
      supplements.push({ name: "Glucosamine & Chondroitin", reason: "Support joint health", timing: "With meals" });
      supplements.push({ name: "Omega-3", reason: "Reduce inflammation", timing: "With meals" });
    }
    
    return supplements;
  };

  const workoutPlan = generateWorkoutPlan();
  const nutritionPlan = generateNutritionPlan();
  const supplements = generateSupplements();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
              FITMATE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onEditProfile}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Welcome back!</p>
                <p className="text-xs text-muted-foreground">{userData.gender}, {userData.age} years</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Weight</p>
                  <p className="text-2xl font-bold">{userData.weight}kg</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BMI</p>
                  <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Progress</p>
                  <p className="text-2xl font-bold">{weeklyProgress}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <Progress value={weeklyProgress} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Goal</p>
                  <p className="text-lg font-medium capitalize">{userData.primaryGoal?.replace('_', ' ')}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Today's Workout */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5" />
                        Today's Workout
                      </CardTitle>
                      <CardDescription>
                        {workoutPlan[0]?.name} • {workoutPlan[0]?.duration}
                      </CardDescription>
                    </div>
                    <Button variant="hero" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workoutPlan[0]?.exercises.slice(0, 4).map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm">{exercise}</span>
                        <Badge variant="outline" className="text-xs">3 sets</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Daily Nutrition
                  </CardTitle>
                  <CardDescription>Target macros for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="text-xl font-bold">{nutritionPlan.calories}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-xl font-bold text-primary">{nutritionPlan.protein}g</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-xl font-bold text-accent">{nutritionPlan.carbs}g</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fats</p>
                      <p className="text-xl font-bold text-secondary">{nutritionPlan.fats}g</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week's Schedule
                </CardTitle>
                <CardDescription>Your personalized workout plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm mb-2">{day}</p>
                      {index < workoutPlan.length ? (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{workoutPlan[index]?.name}</p>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{workoutPlan[index]?.duration}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Rest Day</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <div className="grid gap-6">
              {workoutPlan.map((workout, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{workout.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {workout.duration}
                        </CardDescription>
                      </div>
                      <Button variant="hero">
                        <Play className="mr-2 h-4 w-4" />
                        Start Workout
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="p-3 bg-secondary/30 rounded-lg">
                          <p className="font-medium text-sm">{exercise}</p>
                          <p className="text-xs text-muted-foreground mt-1">3 sets × 12 reps</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Targets</CardTitle>
                  <CardDescription>Based on your goals and activity level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Calories</span>
                      <span className="font-bold">{nutritionPlan.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Protein</span>
                      <span className="font-bold text-primary">{nutritionPlan.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Carbohydrates</span>
                      <span className="font-bold text-accent">{nutritionPlan.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fats</span>
                      <span className="font-bold">{nutritionPlan.fats}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Distribution</CardTitle>
                  <CardDescription>{nutritionPlan.meals} meals per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: nutritionPlan.meals }, (_, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                        <span className="font-medium">
                          {i === 0 ? 'Breakfast' : 
                           i === 1 ? 'Lunch' :
                           i === nutritionPlan.meals - 1 ? 'Dinner' :
                           `Meal ${i + 1}`}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ~{Math.round(nutritionPlan.calories / nutritionPlan.meals)} kcal
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dietary Restrictions */}
            {(userData.dietaryRestrictions?.length || 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Dietary Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.dietaryRestrictions?.map((restriction, index) => (
                      <Badge key={index} variant="outline">{restriction}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="supplements" className="space-y-6">
            <div className="grid gap-4">
              {supplements.map((supplement, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{supplement.name}</h3>
                        <p className="text-muted-foreground">{supplement.reason}</p>
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Best taken: {supplement.timing}</span>
                        </div>
                      </div>
                      <Button variant="outline">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;