import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Users, Zap, ArrowRight, Dumbbell, Heart, Brain, LogIn } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";
import AuthModal from "@/components/AuthModal";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
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
      {/* Header - More student-like design */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-black text-primary tracking-tight">
              FITMATE
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide">How It Works</a>
            <a href="#about" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide">About</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button size="sm" onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
              Start Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Student-like design */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 border-2 border-primary/20 rounded-full">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-wide">
                  AI-Powered Fitness
                </span>
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                  Get Fit with
                  <br />
                  <span className="text-primary">
                    FITMATE AI
                  </span>
                  <br />
                  <span className="text-2xl lg:text-3xl font-semibold text-muted-foreground">
                    Your Personal Trainer
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Finally, a fitness app that actually gets you! Personalized workouts, smart nutrition, 
                  and AI that adapts to YOUR life. No more generic plans! 💪
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-lg font-bold px-8">
                  Let's Get Started! <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowAuthModal(true)} className="text-lg font-semibold px-8">
                  Already a Member?
                </Button>
              </div>
              
              {/* Simplified Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center p-4 bg-card border-2 border-primary/10 rounded-lg">
                  <div className="text-3xl font-black text-primary">{stats[0].value}</div>
                  <div className="text-sm font-semibold text-muted-foreground">{stats[0].label}</div>
                </div>
                <div className="text-center p-4 bg-card border-2 border-accent/10 rounded-lg">
                  <div className="text-3xl font-black text-accent">{stats[2].value}</div>
                  <div className="text-sm font-semibold text-muted-foreground">{stats[2].label}</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="relative p-6 bg-card border-4 border-primary/20 rounded-2xl shadow-lg">
                <img
                  src={heroImage}
                  alt="FITMATE - Your AI Fitness Buddy"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  NEW! 🔥
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - More casual student approach */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 border-2 border-accent/20 rounded-full mb-6">
              <Target className="mr-2 h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-accent uppercase tracking-wide">
                Cool Features
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-6">
              Why FITMATE is
              <span className="text-primary"> Actually Different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tired of boring fitness apps? We built something that actually works for real people 🎯
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Simplified student version */}
      <section id="how-it-works" className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-secondary/50 border-2 border-secondary/50 rounded-full mb-6">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">
                Super Simple
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black mb-6">
              Getting Started is
              <span className="text-accent"> Easy Peasy! 🚀</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1️⃣", title: "Tell Us About You", desc: "Quick questions about your goals and what you like (takes 2 mins!)" },
              { step: "2️⃣", title: "Get Your Plan", desc: "AI creates your custom workout & meal plan instantly" },
              { step: "3️⃣", title: "Start Getting Fit!", desc: "Follow along and watch yourself transform 💪" }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-card border-2 border-primary/10 rounded-2xl hover:border-primary/30 transition-all">
                <div className="text-4xl mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-4 text-primary">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" onClick={onGetStarted} className="bg-accent hover:bg-accent/90 text-lg font-bold px-8">
              I'm Ready! Let's Go! 🎯
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Student style */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y-4 border-primary/20">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-black mb-6">
            Ready to Stop Making Excuses? 💯
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the fitness revolution! Your future fit self is waiting... 
            <br />
            <span className="font-semibold text-primary">What are you waiting for?!</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-lg font-bold px-8">
              Start My Transformation! 🔥
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowAuthModal(true)} className="text-lg font-semibold px-8">
              I Have an Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Simple student footer */}
      <footer className="border-t-2 border-primary/20 py-8 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-black text-primary">
                FITMATE
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FITMATE - Made with ❤️ for fitness lovers everywhere!
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage;