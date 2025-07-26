import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import OnboardingFlow, { UserData } from "@/components/OnboardingFlow";
import Dashboard from "@/components/Dashboard";

type AppState = 'landing' | 'onboarding' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleGetStarted = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setAppState('dashboard');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleEditProfile = () => {
    setAppState('onboarding');
  };

  if (appState === 'onboarding') {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onBack={handleBackToLanding}
      />
    );
  }

  if (appState === 'dashboard' && userData) {
    return (
      <Dashboard 
        userData={userData}
        onEditProfile={handleEditProfile}
      />
    );
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
};

export default Index;
