import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  Brain,
  Zap,
  Award,
  LineChart
} from "lucide-react";
import { UserData } from "@/components/OnboardingFlow";
import { aiService, ProgressData } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface ProgressPredictionProps {
  userData: UserData;
}

export const ProgressPrediction = ({ userData }: ProgressPredictionProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(4); // weeks
  const [prediction, setPrediction] = useState({
    weightChange: 0,
    strengthGain: 0,
    enduranceImprovement: 0,
    confidence: 0
  });
  const [newProgress, setNewProgress] = useState({
    weight: userData.weight,
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    strengthRating: 5,
    enduranceRating: 5,
    consistencyRating: 8
  });
  const { toast } = useToast();

  useEffect(() => {
    aiService.loadStoredData();
    updatePrediction();
  }, [selectedTimeframe, userData]);

  const updatePrediction = () => {
    const pred = aiService.predictProgress(userData, selectedTimeframe);
    setPrediction(pred);
  };

  const handleProgressSubmit = () => {
    const progressData: ProgressData = {
      weight: newProgress.weight,
      measurements: {
        chest: newProgress.chest ? parseFloat(newProgress.chest) : undefined,
        waist: newProgress.waist ? parseFloat(newProgress.waist) : undefined,
        arms: newProgress.arms ? parseFloat(newProgress.arms) : undefined,
        thighs: newProgress.thighs ? parseFloat(newProgress.thighs) : undefined,
      },
      workoutPerformance: {
        strength: newProgress.strengthRating,
        endurance: newProgress.enduranceRating,
        consistency: newProgress.consistencyRating * 10 // Convert to percentage
      },
      date: new Date()
    };

    aiService.addProgressData(progressData);
    updatePrediction();
    
    toast({
      title: "Progress Recorded!",
      description: "Your data helps improve future predictions.",
    });

    // Reset form
    setNewProgress(prev => ({
      ...prev,
      chest: '',
      waist: '',
      arms: '',
      thighs: '',
      strengthRating: 5,
      enduranceRating: 5,
      consistencyRating: 8
    }));
  };

  const timeframeOptions = [
    { value: 1, label: '1 Week' },
    { value: 2, label: '2 Weeks' },
    { value: 4, label: '1 Month' },
    { value: 8, label: '2 Months' },
    { value: 12, label: '3 Months' },
    { value: 24, label: '6 Months' }
  ];

  const getProgressColor = (value: number, isWeight: boolean = false) => {
    if (isWeight) {
      if (userData.primaryGoal === 'weight_loss') {
        return value < 0 ? 'text-green-600' : 'text-red-600';
      } else if (userData.primaryGoal === 'muscle_gain') {
        return value > 0 ? 'text-green-600' : 'text-red-600';
      }
    }
    return value > 0 ? 'text-green-600' : 'text-gray-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Progress Prediction
          </CardTitle>
          <CardDescription>
            Based on your current approach and historical data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prediction" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prediction">Predictions</TabsTrigger>
              <TabsTrigger value="track">Track Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="prediction" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {timeframeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTimeframe === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Weight Change</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xl font-bold ${getProgressColor(prediction.weightChange, true)}`}>
                        {prediction.weightChange > 0 ? '+' : ''}{prediction.weightChange.toFixed(1)}kg
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedTimeframe} week{selectedTimeframe > 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Strength Gain</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xl font-bold ${getProgressColor(prediction.strengthGain)}`}>
                        +{(prediction.strengthGain * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expected improvement
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Endurance</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-xl font-bold ${getProgressColor(prediction.enduranceImprovement)}`}>
                        +{(prediction.enduranceImprovement * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cardiovascular improvement
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Prediction Confidence</span>
                </div>
                <Badge className={getConfidenceColor(prediction.confidence)}>
                  {Math.round(prediction.confidence * 100)}%
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-3 w-3" />
                  <span className="font-medium">How predictions work:</span>
                </div>
                Predictions are based on your current routine, past progress data, fitness level, and goal alignment. 
                Higher confidence indicates more historical data and consistent patterns.
              </div>
            </TabsContent>

            <TabsContent value="track" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newProgress.weight}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, weight: parseFloat(e.target.value) || userData.weight }))}
                    placeholder={userData.weight.toString()}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Measurements (cm)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Chest"
                      value={newProgress.chest}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, chest: e.target.value }))}
                    />
                    <Input
                      placeholder="Waist"
                      value={newProgress.waist}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, waist: e.target.value }))}
                    />
                    <Input
                      placeholder="Arms"
                      value={newProgress.arms}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, arms: e.target.value }))}
                    />
                    <Input
                      placeholder="Thighs"
                      value={newProgress.thighs}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, thighs: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Strength Level (1-10)</Label>
                  <div className="mt-2">
                    <Progress value={newProgress.strengthRating * 10} className="w-full" />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newProgress.strengthRating}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, strengthRating: parseInt(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Weak</span>
                      <span className="font-medium">{newProgress.strengthRating}/10</span>
                      <span>Very Strong</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Endurance Level (1-10)</Label>
                  <div className="mt-2">
                    <Progress value={newProgress.enduranceRating * 10} className="w-full" />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newProgress.enduranceRating}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, enduranceRating: parseInt(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span className="font-medium">{newProgress.enduranceRating}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Weekly Consistency (1-10)</Label>
                  <div className="mt-2">
                    <Progress value={newProgress.consistencyRating * 10} className="w-full" />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newProgress.consistencyRating}
                      onChange={(e) => setNewProgress(prev => ({ ...prev, consistencyRating: parseInt(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Inconsistent</span>
                      <span className="font-medium">{newProgress.consistencyRating}/10</span>
                      <span>Perfect</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleProgressSubmit} className="w-full">
                <LineChart className="mr-2 h-4 w-4" />
                Record Progress
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
