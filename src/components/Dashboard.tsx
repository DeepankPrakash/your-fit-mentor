import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
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
  Play,
  RefreshCw,
  ChefHat,
  Timer
} from "lucide-react";
import { UserData } from "./OnboardingFlow";

interface DashboardProps {
  userData: UserData;
  onEditProfile: () => void;
}

const Dashboard = ({ userData, onEditProfile }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [planSeed, setPlanSeed] = useState(Date.now()); // For generating different plans
  const { toast } = useToast();

  // Calculate BMI
  const bmi = userData.weight / Math.pow(userData.height / 100, 2);
  
  // Weekly progress (mock data)
  const weeklyProgress = 65;

  // Generate new plans function
  const generateNewPlans = () => {
    setPlanSeed(Date.now());
    toast({
      title: "New Plans Generated!",
      description: "Your workout and nutrition plans have been refreshed with new recommendations.",
    });
  };

  // Generate workout plan based on user data with randomization (7 days)
  const generateWorkoutPlan = () => {
    const workouts = [];
    const frequency = parseInt(userData.workoutFrequency?.replace('_days', '') || '3');
    
    const beginnerWorkouts = [
      { name: "Full Body Strength", duration: "45 min", exercises: ["Push-ups", "Squats", "Plank", "Lunges"] },
      { name: "Cardio & Core", duration: "30 min", exercises: ["Walking", "Knee Raises", "Dead Bug", "Bird Dog"] },
      { name: "Upper Body Focus", duration: "40 min", exercises: ["Wall Push-ups", "Arm Circles", "Resistance Band Rows"] },
      { name: "Flexibility & Mobility", duration: "35 min", exercises: ["Cat-Cow", "Child's Pose", "Hip Circles", "Arm Swings"] },
      { name: "Beginner HIIT", duration: "25 min", exercises: ["Marching in Place", "Modified Burpees", "Step-ups", "Arm Raises"] },
      { name: "Core Foundation", duration: "30 min", exercises: ["Modified Plank", "Knee Raises", "Side Crunches", "Glute Bridges"] },
    ];
    
    const intermediateWorkouts = [
      { name: "Push Day", duration: "60 min", exercises: ["Bench Press", "Shoulder Press", "Dips", "Push-ups"] },
      { name: "Pull Day", duration: "60 min", exercises: ["Pull-ups", "Rows", "Lat Pulldowns", "Bicep Curls"] },
      { name: "Leg Day", duration: "75 min", exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"] },
      { name: "Cardio HIIT", duration: "45 min", exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
      { name: "Upper Power", duration: "55 min", exercises: ["Incline Press", "Pull-ups", "Military Press", "Barbell Rows"] },
      { name: "Lower Power", duration: "70 min", exercises: ["Front Squats", "Romanian Deadlifts", "Bulgarian Squats", "Hip Thrusts"] },
      { name: "Functional Training", duration: "50 min", exercises: ["Farmer's Walk", "Turkish Get-ups", "Kettlebell Swings", "Box Jumps"] },
      { name: "Metabolic Circuit", duration: "40 min", exercises: ["Thrusters", "Battle Ropes", "Rowing Machine", "Assault Bike"] },
    ];
    
    const advancedWorkouts = [
      { name: "Heavy Compound", duration: "90 min", exercises: ["Deadlifts", "Squats", "Bench Press", "Rows"] },
      { name: "Olympic Lifts", duration: "75 min", exercises: ["Clean & Jerk", "Snatch", "Front Squats"] },
      { name: "HIIT Circuit", duration: "60 min", exercises: ["Box Jumps", "Battle Ropes", "Kettlebell Swings"] },
      { name: "Accessory Work", duration: "45 min", exercises: ["Isolation Exercises", "Core Work", "Mobility"] },
      { name: "Powerlifting Focus", duration: "85 min", exercises: ["Competition Squats", "Competition Bench", "Competition Deadlift", "Pause Reps"] },
      { name: "Athletic Performance", duration: "70 min", exercises: ["Plyometric Training", "Speed Ladders", "Medicine Ball Throws", "Sprint Intervals"] },
      { name: "Strongman Training", duration: "80 min", exercises: ["Atlas Stones", "Tire Flips", "Sled Pulls", "Log Press"] },
      { name: "Hypertrophy Focus", duration: "65 min", exercises: ["High Volume Squats", "Drop Sets", "Supersets", "Time Under Tension"] },
    ];
    
    let workoutPool = beginnerWorkouts;
    if (userData.fitnessLevel === 'intermediate') workoutPool = intermediateWorkouts;
    if (userData.fitnessLevel === 'advanced') workoutPool = advancedWorkouts;
    
    // Shuffle workouts based on plan seed for variety
    const shuffledWorkouts = [...workoutPool].sort(() => {
      const random = Math.sin(planSeed + workoutPool.indexOf(workoutPool[0])) * 10000;
      return random - Math.floor(random);
    });
    
    // Filter out exercises that might aggravate injuries
    const filteredWorkouts = shuffledWorkouts.map(workout => {
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
    
    // Generate 7 days of workouts, cycling through available workouts
    const weekPlan = [];
    for (let i = 0; i < 7; i++) {
      if (i < frequency || (i >= 7 - frequency && frequency > 4)) {
        weekPlan.push(filteredWorkouts[i % filteredWorkouts.length]);
      } else {
        weekPlan.push({ name: "Rest Day", duration: "0 min", exercises: ["Active Recovery", "Light Stretching"] });
      }
    }
    return weekPlan;
  };

  // Generate detailed meal plans with recipes (7 days worth)
  const generateMealPlans = () => {
    const mealPlans = {
      'weight_loss': [
        {
          name: "Grilled Chicken & Quinoa Bowl",
          calories: 450,
          protein: 35,
          carbs: 40,
          fats: 12,
          ingredients: ["chicken breast", "quinoa", "broccoli", "bell peppers", "olive oil", "garlic"],
          instructions: [
            "Season chicken breast with salt, pepper, and garlic powder",
            "Grill chicken for 6-7 minutes per side until cooked through",
            "Cook quinoa according to package directions (1:2 ratio with water)",
            "Steam broccoli for 4-5 minutes until tender-crisp",
            "Sauté bell peppers in 1 tsp olive oil for 3-4 minutes",
            "Slice chicken and serve over quinoa with vegetables",
            "Drizzle with remaining olive oil and season to taste"
          ],
          prepTime: "25 minutes",
          difficulty: "Easy"
        },
        {
          name: "Salmon & Sweet Potato",
          calories: 420,
          protein: 32,
          carbs: 35,
          fats: 15,
          ingredients: ["salmon fillet", "sweet potato", "asparagus", "lemon", "herbs"],
          instructions: [
            "Preheat oven to 400°F (200°C)",
            "Pierce sweet potato and microwave for 5 minutes",
            "Season salmon with herbs, salt, and pepper",
            "Bake salmon and sweet potato for 15-18 minutes",
            "Steam asparagus for 3-4 minutes",
            "Serve with lemon wedges"
          ],
          prepTime: "20 minutes",
          difficulty: "Easy"
        }
      ],
      'muscle_gain': [
        {
          name: "Power Protein Pasta",
          calories: 650,
          protein: 45,
          carbs: 65,
          fats: 18,
          ingredients: ["whole wheat pasta", "lean ground turkey", "marinara sauce", "mozzarella", "spinach"],
          instructions: [
            "Cook pasta according to package directions",
            "Brown ground turkey in a large pan with onions",
            "Add marinara sauce and simmer for 10 minutes",
            "Stir in fresh spinach until wilted",
            "Combine with cooked pasta",
            "Top with mozzarella cheese and serve hot"
          ],
          prepTime: "30 minutes",
          difficulty: "Medium"
        },
        {
          name: "Steak & Rice Power Bowl",
          calories: 720,
          protein: 48,
          carbs: 60,
          fats: 22,
          ingredients: ["sirloin steak", "brown rice", "black beans", "avocado", "peppers"],
          instructions: [
            "Cook brown rice (1 cup rice to 2 cups water, simmer 45 min)",
            "Season steak with salt, pepper, and garlic",
            "Grill steak 4-5 minutes per side for medium-rare",
            "Heat black beans with cumin and paprika",
            "Slice avocado and sauté peppers",
            "Let steak rest 5 minutes, then slice",
            "Serve over rice with beans, peppers, and avocado"
          ],
          prepTime: "35 minutes",
          difficulty: "Medium"
        }
      ],
      'maintenance': [
        {
          name: "Mediterranean Chicken",
          calories: 520,
          protein: 38,
          carbs: 45,
          fats: 20,
          ingredients: ["chicken thighs", "couscous", "tomatoes", "olives", "feta cheese", "herbs"],
          instructions: [
            "Season chicken thighs with Mediterranean herbs",
            "Cook chicken in oven at 375°F for 25-30 minutes",
            "Prepare couscous with chicken broth for extra flavor",
            "Dice tomatoes and mix with olives and feta",
            "Serve chicken over couscous topped with tomato mixture"
          ],
          prepTime: "35 minutes",
          difficulty: "Easy"
        },
        {
          name: "Lentil Power Curry",
          calories: 380,
          protein: 22,
          carbs: 48,
          fats: 8,
          ingredients: ["red lentils", "coconut milk", "spinach", "tomatoes", "curry spices", "brown rice"],
          instructions: [
            "Rinse red lentils and cook in vegetable broth for 15 minutes",
            "Sauté onions, garlic, and curry spices for 2-3 minutes",
            "Add diced tomatoes and coconut milk, simmer 10 minutes",
            "Stir in cooked lentils and spinach until wilted",
            "Serve over brown rice with fresh cilantro"
          ],
          prepTime: "30 minutes",
          difficulty: "Easy"
        }
      ]
    };

    const goalMeals = mealPlans[userData.primaryGoal as keyof typeof mealPlans] || mealPlans.maintenance;
    const mealsPerDay = parseInt(userData.preferredMeals?.toString() || '3');
    
    // Generate enough meals for a week - cycle through available meals
    const weekMeals = [];
    for (let day = 0; day < 7; day++) {
      for (let meal = 0; meal < mealsPerDay; meal++) {
        const mealIndex = (day * mealsPerDay + meal) % goalMeals.length;
        weekMeals.push({
          ...goalMeals[mealIndex],
          day: day + 1,
          mealNumber: meal + 1,
          mealType: meal === 0 ? 'Breakfast' : meal === 1 ? 'Lunch' : meal === mealsPerDay - 1 ? 'Dinner' : `Meal ${meal + 1}`
        });
      }
    }

    return weekMeals;
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

  // Generate supplement recommendations with detailed descriptions
  const generateSupplements = () => {
    const supplements = [];
    
    // Base recommendations
    supplements.push({ 
      name: "Whey Protein Isolate", 
      reason: "Support muscle protein synthesis and recovery", 
      timing: "Post-workout",
      description: "High-quality complete protein containing all essential amino acids. Whey protein isolate is rapidly absorbed, making it ideal for post-workout recovery. It helps repair muscle tissue damaged during exercise and promotes lean muscle growth.",
      dosage: "25-30g per serving",
      benefits: ["Fast absorption", "Complete amino acid profile", "Supports muscle recovery", "Helps maintain lean muscle mass"]
    });
    
    supplements.push({ 
      name: "Multivitamin Complex", 
      reason: "Fill nutritional gaps in your diet", 
      timing: "With breakfast",
      description: "A comprehensive blend of essential vitamins and minerals to support overall health and fill potential nutritional gaps in your diet. Especially important for active individuals with increased nutrient needs.",
      dosage: "1 tablet daily",
      benefits: ["Supports immune function", "Maintains energy levels", "Promotes overall health", "Fills dietary gaps"]
    });
    
    // Goal-specific
    if (userData.primaryGoal === 'muscle_gain') {
      supplements.push({ 
        name: "Creatine Monohydrate", 
        reason: "Increase strength, power, and muscle mass", 
        timing: "Post-workout",
        description: "The most researched supplement for strength and muscle building. Creatine increases your muscles' phosphocreatine stores, allowing for more ATP production during high-intensity exercise, leading to improved performance and muscle growth.",
        dosage: "5g daily",
        benefits: ["Increases muscle strength", "Improves power output", "Enhances muscle volume", "Supports muscle growth"]
      });
      supplements.push({ 
        name: "BCAAs (Leucine, Isoleucine, Valine)", 
        reason: "Reduce muscle breakdown and support recovery", 
        timing: "During workout",
        description: "Branched-Chain Amino Acids are essential amino acids that your body cannot produce. They help reduce muscle protein breakdown during exercise and stimulate muscle protein synthesis, especially leucine.",
        dosage: "10-15g during training",
        benefits: ["Reduces muscle breakdown", "Supports muscle synthesis", "Decreases exercise fatigue", "Improves recovery"]
      });
    }
    
    if (userData.primaryGoal === 'weight_loss') {
      supplements.push({ 
        name: "L-Carnitine", 
        reason: "Support fat metabolism and energy production", 
        timing: "Pre-workout",
        description: "An amino acid derivative that plays a crucial role in energy production by transporting fatty acids into your cells' mitochondria, where they can be burned for energy. Particularly effective when combined with exercise.",
        dosage: "2-3g before training",
        benefits: ["Enhances fat oxidation", "Improves exercise performance", "Supports energy production", "May reduce exercise fatigue"]
      });
      supplements.push({ 
        name: "Green Tea Extract (EGCG)", 
        reason: "Boost metabolism and support fat loss", 
        timing: "Between meals",
        description: "Contains catechins, particularly EGCG, which can increase metabolic rate and enhance fat oxidation. Also provides antioxidant benefits and may help with appetite control.",
        dosage: "400-500mg daily",
        benefits: ["Increases metabolic rate", "Enhances fat burning", "Provides antioxidants", "Supports appetite control"]
      });
    }
    
    if (userData.primaryGoal === 'endurance') {
      supplements.push({ 
        name: "Beta-Alanine", 
        reason: "Improve muscular endurance and reduce fatigue", 
        timing: "Pre-workout",
        description: "A non-essential amino acid that increases carnosine levels in muscles, which helps buffer acid buildup during high-intensity exercise, allowing you to train harder for longer periods.",
        dosage: "3-5g daily",
        benefits: ["Increases muscular endurance", "Reduces muscle fatigue", "Improves training capacity", "Enhances performance in high-intensity activities"]
      });
      supplements.push({ 
        name: "Electrolyte Complex", 
        reason: "Maintain hydration and prevent cramping", 
        timing: "During workout",
        description: "A balanced blend of sodium, potassium, magnesium, and calcium to replace electrolytes lost through sweat. Essential for maintaining proper muscle function and preventing dehydration during long training sessions.",
        dosage: "As needed during exercise",
        benefits: ["Maintains hydration", "Prevents muscle cramps", "Supports muscle function", "Enhances endurance performance"]
      });
    }
    
    // Injury-specific
    if (userData.injuries?.some(injury => injury.includes('Joint') || injury.includes('Arthritis'))) {
      supplements.push({ 
        name: "Glucosamine & Chondroitin Sulfate", 
        reason: "Support joint health and cartilage maintenance", 
        timing: "With meals",
        description: "Natural compounds found in healthy cartilage. Glucosamine helps build and maintain cartilage, while chondroitin helps cartilage retain water and maintain its elasticity. Together, they support joint health and may reduce joint discomfort.",
        dosage: "1500mg glucosamine + 1200mg chondroitin daily",
        benefits: ["Supports cartilage health", "May reduce joint discomfort", "Improves joint mobility", "Supports long-term joint health"]
      });
      supplements.push({ 
        name: "Omega-3 Fatty Acids (EPA/DHA)", 
        reason: "Reduce inflammation and support joint health", 
        timing: "With meals",
        description: "Essential fatty acids with powerful anti-inflammatory properties. EPA and DHA help reduce systemic inflammation, which can benefit joint health, recovery, and overall wellness.",
        dosage: "2-3g daily (combined EPA/DHA)",
        benefits: ["Reduces inflammation", "Supports joint health", "Improves recovery", "Promotes cardiovascular health"]
      });
    }
    
    return supplements;
  };

  const workoutPlan = generateWorkoutPlan();
  const nutritionPlan = generateNutritionPlan();
  const supplements = generateSupplements();
  const mealPlans = generateMealPlans();

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
            <Button variant="outline" onClick={generateNewPlans}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Plans
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Coach</TabsTrigger>
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
            <div className="grid md:grid-cols-2 gap-6 mb-6">
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

            {/* Detailed Meal Plans with Recipes */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">7-Day Meal Plan</h3>
                <Badge variant="secondary">AI Generated</Badge>
                <Badge variant="outline">{userData.preferredMeals} meals/day</Badge>
              </div>
              
              {/* Group meals by day */}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayMeals = mealPlans.filter(meal => meal.day === dayIndex + 1);
                const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex];
                
                return (
                  <div key={dayIndex} className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary border-b pb-2">
                      Day {dayIndex + 1} - {dayName}
                    </h4>
                    <div className="grid gap-4">
                      {dayMeals.map((meal, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Utensils className="h-5 w-5" />
                                  {meal.mealType}: {meal.name}
                                </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              {meal.prepTime}
                            </span>
                            <Badge variant="outline">{meal.difficulty}</Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{meal.calories}</div>
                          <div className="text-xs text-muted-foreground">calories</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Macros */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="font-bold text-primary">{meal.protein}g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div className="text-center p-3 bg-accent/10 rounded-lg">
                          <div className="font-bold text-accent">{meal.carbs}g</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="font-bold">{meal.fats}g</div>
                          <div className="text-xs text-muted-foreground">Fats</div>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <h4 className="font-semibold mb-3">Ingredients:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {meal.ingredients.map((ingredient, idx) => (
                            <Badge key={idx} variant="outline" className="justify-start">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Cooking Instructions */}
                      <div>
                        <h4 className="font-semibold mb-3">Cooking Instructions:</h4>
                        <div className="space-y-3">
                          {meal.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                {idx + 1}
                              </div>
                              <p className="text-sm leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant="hero">
                        <Play className="mr-2 h-4 w-4" />
                        Start Cooking
                      </Button>
                    </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
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
            <div className="grid gap-6">
              {supplements.map((supplement, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-xl text-primary">{supplement.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{supplement.reason}</p>
                        </div>
                        <Button variant="outline">Add to Cart</Button>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">{supplement.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Dosage: {supplement.dosage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-accent" />
                              <span className="text-sm font-medium">Best taken: {supplement.timing}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Key Benefits:</h4>
                            <div className="flex flex-wrap gap-1">
                              {supplement.benefits.map((benefit, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  AI Fitness Coach
                </CardTitle>
                <CardDescription>Get personalized advice and answers to your fitness questions</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 bg-muted/30 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>AI Coach:</strong> Hello! I'm your personal fitness coach. I can help you with workout modifications, nutrition advice, form corrections, and answer any fitness-related questions. What would you like to know?
                      </p>
                    </div>
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>You:</strong> How can I improve my workout consistency?
                      </p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>AI Coach:</strong> Great question! Based on your profile, here are some personalized tips: 1) Start with your current {userData.workoutFrequency?.replace('_', ' ')} schedule - it's realistic for your lifestyle. 2) Set specific workout times and treat them like important appointments. 3) Prepare your workout clothes the night before. 4) Track your progress to stay motivated. 5) Have backup 15-minute workouts for busy days. Would you like specific advice for any particular challenge you're facing?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask your AI coach anything..." 
                    className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                  />
                  <Button variant="hero">Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;