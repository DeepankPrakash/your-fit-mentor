import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, User, Target, Utensils, AlertTriangle, Activity } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (userData: UserData) => void;
  onBack: () => void;
}

export interface UserData {
  // Personal Info
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;

  // Goals
  primaryGoal: string;
  targetWeight?: number;
  timeframe: string;

  // Dietary Preferences
  dietaryRestrictions: string[];
  allergies: string[];
  preferredMeals: number;

  // Injuries & Limitations
  injuries: string[];
  limitations: string;

  // Experience
  fitnessLevel: string;
  workoutFrequency: string;
  preferredWorkoutTime: string;
}

const OnboardingFlow = ({ onComplete, onBack }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({
    dietaryRestrictions: [],
    allergies: [],
    injuries: [],
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(userData as UserData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const updateUserData = (field: string, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (field: string, value: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof UserData] as string[]), value]
        : (prev[field as keyof UserData] as string[]).filter(item => item !== value)
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
              <CardDescription>Basic information to personalize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={userData.age || ''}
                    onChange={(e) => updateUserData('age', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={userData.gender || ''} 
                    onValueChange={(value) => updateUserData('gender', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={userData.height || ''}
                    onChange={(e) => updateUserData('height', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={userData.weight || ''}
                    onChange={(e) => updateUserData('weight', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <RadioGroup 
                  value={userData.activityLevel || ''} 
                  onValueChange={(value) => updateUserData('activityLevel', value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {[
                    { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                    { value: 'light', label: 'Lightly Active', desc: '1-3 days per week' },
                    { value: 'moderate', label: 'Moderately Active', desc: '3-5 days per week' },
                    { value: 'very', label: 'Very Active', desc: '6-7 days per week' },
                    { value: 'extra', label: 'Extra Active', desc: '2x per day or intense exercise' },
                  ].map((level) => (
                    <div key={level.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div>
                        <Label htmlFor={level.value} className="font-medium">{level.label}</Label>
                        <p className="text-sm text-muted-foreground">{level.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">What Are Your Goals?</CardTitle>
              <CardDescription>Define what you want to achieve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <RadioGroup 
                  value={userData.primaryGoal || ''} 
                  onValueChange={(value) => updateUserData('primaryGoal', value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {[
                    { value: 'weight_loss', label: 'Weight Loss', desc: 'Burn fat and lose weight' },
                    { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build muscle and strength' },
                    { value: 'maintenance', label: 'Maintenance', desc: 'Maintain current physique' },
                    { value: 'endurance', label: 'Endurance', desc: 'Improve cardiovascular health' },
                    { value: 'strength', label: 'Strength', desc: 'Increase overall strength' },
                    { value: 'flexibility', label: 'Flexibility', desc: 'Improve mobility and flexibility' },
                  ].map((goal) => (
                    <div key={goal.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={goal.value} id={goal.value} />
                      <div>
                        <Label htmlFor={goal.value} className="font-medium">{goal.label}</Label>
                        <p className="text-sm text-muted-foreground">{goal.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(userData.primaryGoal === 'weight_loss' || userData.primaryGoal === 'muscle_gain') && (
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="65"
                    value={userData.targetWeight || ''}
                    onChange={(e) => updateUserData('targetWeight', parseInt(e.target.value))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <RadioGroup 
                  value={userData.timeframe || ''} 
                  onValueChange={(value) => updateUserData('timeframe', value)}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: '1_month', label: '1 Month' },
                    { value: '3_months', label: '3 Months' },
                    { value: '6_months', label: '6 Months' },
                    { value: '1_year', label: '1 Year' },
                  ].map((time) => (
                    <div key={time.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={time.value} id={time.value} />
                      <Label htmlFor={time.value} className="font-medium">{time.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Dietary Preferences</CardTitle>
              <CardDescription>Tell us about your food preferences and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Dietary Restrictions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Vegetarian', 'Vegan', 'Pescatarian', 'Keto',
                    'Paleo', 'Mediterranean', 'Gluten-Free', 'Dairy-Free',
                    'No Beef', 'No Pork', 'No Fish', 'Halal', 'Kosher'
                  ].map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox
                        id={restriction}
                        checked={userData.dietaryRestrictions?.includes(restriction)}
                        onCheckedChange={(checked) => 
                          handleArrayUpdate('dietaryRestrictions', restriction, checked as boolean)
                        }
                      />
                      <Label htmlFor={restriction}>{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Common Allergies (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Nuts', 'Shellfish', 'Eggs', 'Soy',
                    'Avocado', 'Lactose', 'Gluten', 'Seeds'
                  ].map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={userData.allergies?.includes(allergy)}
                        onCheckedChange={(checked) => 
                          handleArrayUpdate('allergies', allergy, checked as boolean)
                        }
                      />
                      <Label htmlFor={allergy}>{allergy}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meals">Preferred Number of Meals per Day</Label>
                <RadioGroup 
                  value={userData.preferredMeals?.toString() || ''} 
                  onValueChange={(value) => updateUserData('preferredMeals', parseInt(value))}
                  className="flex gap-6"
                >
                  {[3, 4, 5, 6].map((meals) => (
                    <div key={meals} className="flex items-center space-x-2">
                      <RadioGroupItem value={meals.toString()} id={`meals-${meals}`} />
                      <Label htmlFor={`meals-${meals}`}>{meals} meals</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Injuries & Limitations</CardTitle>
              <CardDescription>Help us create a safe workout plan for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Current or Past Injuries (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Knee Pain', 'Back Pain', 'Shoulder Issues', 'Ankle Problems',
                    'Wrist Pain', 'Neck Issues', 'Hip Problems', 'Elbow Pain',
                    'Previous Surgery', 'Arthritis', 'Other Joint Issues'
                  ].map((injury) => (
                    <div key={injury} className="flex items-center space-x-2">
                      <Checkbox
                        id={injury}
                        checked={userData.injuries?.includes(injury)}
                        onCheckedChange={(checked) => 
                          handleArrayUpdate('injuries', injury, checked as boolean)
                        }
                      />
                      <Label htmlFor={injury}>{injury}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limitations">Additional Limitations or Medical Conditions</Label>
                <Textarea
                  id="limitations"
                  placeholder="Describe any other physical limitations, medical conditions, or concerns we should know about..."
                  value={userData.limitations || ''}
                  onChange={(e) => updateUserData('limitations', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Fitness Experience</CardTitle>
              <CardDescription>Tell us about your fitness background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Fitness Level</Label>
                <RadioGroup 
                  value={userData.fitnessLevel || ''} 
                  onValueChange={(value) => updateUserData('fitnessLevel', value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'New to exercise or returning after a long break' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Regular exercise for 6+ months' },
                    { value: 'advanced', label: 'Advanced', desc: 'Consistent training for 2+ years' },
                  ].map((level) => (
                    <div key={level.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div>
                        <Label htmlFor={level.value} className="font-medium">{level.label}</Label>
                        <p className="text-sm text-muted-foreground">{level.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Preferred Workout Frequency</Label>
                <RadioGroup 
                  value={userData.workoutFrequency || ''} 
                  onValueChange={(value) => updateUserData('workoutFrequency', value)}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: '3_days', label: '3 days/week' },
                    { value: '4_days', label: '4 days/week' },
                    { value: '5_days', label: '5 days/week' },
                    { value: '6_days', label: '6 days/week' },
                  ].map((freq) => (
                    <div key={freq.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={freq.value} id={freq.value} />
                      <Label htmlFor={freq.value} className="font-medium">{freq.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Preferred Workout Time</Label>
                <RadioGroup 
                  value={userData.preferredWorkoutTime || ''} 
                  onValueChange={(value) => updateUserData('preferredWorkoutTime', value)}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: 'morning', label: 'Morning (6-10 AM)' },
                    { value: 'midday', label: 'Midday (10 AM-2 PM)' },
                    { value: 'afternoon', label: 'Afternoon (2-6 PM)' },
                    { value: 'evening', label: 'Evening (6-10 PM)' },
                  ].map((time) => (
                    <div key={time.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50">
                      <RadioGroupItem value={time.value} id={time.value} />
                      <Label htmlFor={time.value} className="font-medium">{time.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Step {step} of {totalSteps}
            </Badge>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? 'Back to Home' : 'Previous'}
          </Button>
          <Button variant="hero" onClick={handleNext}>
            {step === totalSteps ? 'Complete Setup' : 'Next Step'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;