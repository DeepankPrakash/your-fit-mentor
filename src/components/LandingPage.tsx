import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Users, Zap, ArrowRight, Dumbbell, Heart, Brain } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Target,
      title: "Personalized Plans",
      description: "AI-driven workout and diet plans tailored to your goals, restrictions, and injury conditions."
    },
    {
      icon: Dumbbell,
      title: "Smart Workouts",
      description: "Exercise routines that adapt to your fitness level and avoid movements that could aggravate injuries."
    },
    {
      icon: Heart,
      title: "Nutrition Focused",
      description: "High-protein, calorie-specific meal plans that match your dietary preferences and goals."
    },
    {
      icon: Brain,
      title: "AI Supplements",
      description: "Intelligent supplement recommendations to optimize your performance and recovery."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1M+", label: "Workouts Generated" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
              FITMATE
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          </nav>
          <Button variant="hero" size="lg" onClick={onGetStarted}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 flex items-center min-h-[90vh] py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Zap className="mr-2 h-4 w-4" />
                AI-Powered Fitness Assistant
              </Badge>
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Your Personal
                  <span className="bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    {" "}AI Fitness{" "}
                  </span>
                  Coach
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  Get personalized workout plans, nutrition guidance, and supplement recommendations 
                  tailored to your goals, preferences, and physical conditions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={onGetStarted} className="bg-white text-primary hover:bg-white/90">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <img
                src={heroImage}
                alt="FITMATE - AI Fitness Assistant"
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Target className="mr-2 h-4 w-4" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need for
              <span className="bg-primary-gradient bg-clip-text text-transparent"> Fitness Success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with fitness expertise 
              to deliver personalized solutions that adapt to your unique needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="mr-2 h-4 w-4" />
              Simple Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Get Started in
              <span className="bg-accent-gradient bg-clip-text text-transparent"> 3 Easy Steps</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Share Your Profile", desc: "Tell us about your goals, preferences, and any physical limitations." },
              { step: "02", title: "Get Your Plan", desc: "Our AI creates personalized workout and nutrition plans just for you." },
              { step: "03", title: "Track Progress", desc: "Follow your plan and watch as you achieve your fitness goals." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have achieved their fitness goals with FITMATE's AI-powered guidance.
          </p>
          <Button variant="hero" size="xl" onClick={onGetStarted} className="bg-white text-primary hover:bg-white/90">
            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                FITMATE
              </span>
            </div>
            <p className="text-muted-foreground">© 2024 FITMATE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;