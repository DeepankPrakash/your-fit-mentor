import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Send, 
  User, 
  Bot, 
  Lightbulb, 
  Target, 
  Activity,
  Utensils,
  Heart,
  Clock,
  TrendingUp
} from "lucide-react";
import { UserData } from "@/components/OnboardingFlow";
import { aiService, AIRecommendation } from "@/services/aiService";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'workout' | 'nutrition' | 'motivation' | 'progress' | 'general';
}

interface EnhancedAICoachProps {
  userData: UserData;
  recommendations: AIRecommendation[];
}

export const EnhancedAICoach = ({ userData, recommendations }: EnhancedAICoachProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      id: 'motivation', 
      label: 'Need Motivation', 
      icon: Heart, 
      prompt: "I'm feeling unmotivated today. Can you help?" 
    },
    { 
      id: 'workout-tips', 
      label: 'Workout Tips', 
      icon: Activity, 
      prompt: "Can you give me some workout tips based on my current routine?" 
    },
    { 
      id: 'nutrition-advice', 
      label: 'Nutrition Help', 
      icon: Utensils, 
      prompt: "I need advice about my nutrition plan" 
    },
    { 
      id: 'progress-check', 
      label: 'Progress Check', 
      icon: TrendingUp, 
      prompt: "How am I doing with my fitness goals?" 
    },
    { 
      id: 'time-management', 
      label: 'Time Management', 
      icon: Clock, 
      prompt: "I'm struggling to find time for workouts. Any suggestions?" 
    },
    { 
      id: 'goal-adjustment', 
      label: 'Adjust Goals', 
      icon: Target, 
      prompt: "I want to adjust my fitness goals. Can you help?" 
    }
  ];

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        type: 'ai',
        content: getPersonalizedWelcome(),
        timestamp: new Date(),
        category: 'general'
      };
      setMessages([welcomeMessage]);
    }
  }, [userData]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getPersonalizedWelcome = () => {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 17 ? 'Good afternoon' : 'Good evening';
    
    const goalText = userData.primaryGoal?.replace('_', ' ') || 'fitness';
    const levelText = userData.fitnessLevel || 'your current level';
    
    return `${greeting}! I'm your AI fitness coach, here to support your ${goalText} journey. As a ${levelText} fitness enthusiast, I'll provide personalized advice based on your progress and preferences. How can I help you today? 💪`;
  };

  const categorizeMessage = (content: string): 'workout' | 'nutrition' | 'motivation' | 'progress' | 'general' => {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('workout') || lowerContent.includes('exercise') || lowerContent.includes('training')) {
      return 'workout';
    }
    if (lowerContent.includes('diet') || lowerContent.includes('nutrition') || lowerContent.includes('meal') || lowerContent.includes('food')) {
      return 'nutrition';
    }
    if (lowerContent.includes('motivat') || lowerContent.includes('tired') || lowerContent.includes('give up') || lowerContent.includes('difficult')) {
      return 'motivation';
    }
    if (lowerContent.includes('progress') || lowerContent.includes('result') || lowerContent.includes('improvement')) {
      return 'progress';
    }
    return 'general';
  };

  const sendMessage = async (content: string = inputMessage) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      category: categorizeMessage(content)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = aiService.generateContextualResponse(content, userData);
      
      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        category: userMessage.category
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
    setSelectedQuickAction(null);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'workout': return <Activity className="h-3 w-3" />;
      case 'nutrition': return <Utensils className="h-3 w-3" />;
      case 'motivation': return <Heart className="h-3 w-3" />;
      case 'progress': return <TrendingUp className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'workout': return 'text-blue-600';
      case 'nutrition': return 'text-green-600';
      case 'motivation': return 'text-red-600';
      case 'progress': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Enhanced AI Fitness Coach
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Context-Aware
          </Badge>
          <span>Personalized advice based on your progress and goals</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1">
          {quickActions.slice(0, 3).map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.prompt)}
                className="text-xs h-7"
              >
                <Icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* AI Recommendations Summary */}
        {recommendations.length > 0 && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">Active Recommendations</span>
            </div>
            <div className="text-xs text-muted-foreground">
              I have {recommendations.length} personalized suggestion{recommendations.length > 1 ? 's' : ''} for you. 
              Ask me about them!
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className={`${getCategoryColor(message.category)}`}>
                      {getCategoryIcon(message.category)}
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-1">
                    <span>AI is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="space-y-2">
          {/* More Quick Actions */}
          <div className="flex flex-wrap gap-1">
            {quickActions.slice(3).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  className="text-xs h-6"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your AI coach anything..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
              className="text-sm"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
