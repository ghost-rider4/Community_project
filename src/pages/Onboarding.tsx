import React, { useState } from 'react';
import { ArrowRight, Music, Palette, Atom, Code, ArrowLeft, Brain, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

type OnboardingStep = 'welcome' | 'complete';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [psychometricSkipped, setPsychometricSkipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useAuth();
  const navigate = useNavigate();
  
  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      await updateUserData({
        onboardingCompleted: true,
        profileSetup: false
      });

      navigate('/talent-selection');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <img 
              src="/image.png" 
              alt="ElevatED" 
              className="w-20 h-20 mx-auto mb-8 object-contain"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to ElevatED
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Where gifted minds meet
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your journey to connect with like-minded peers and expert mentors starts here. 
              Let's discover your unique talents and build your personalized learning experience.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">🎯 Personalized Experience</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Take our psychometric assessment to get tailored recommendations</p>
              </Card>
              <Card className="p-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <SkipForward className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">🚀 Skip & Explore</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Jump straight to talent selection if you know what interests you</p>
              </Card>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/psychometric-assessment')} size="lg">
                Take Assessment
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => {
                setPsychometricSkipped(true);
                navigate('/talent-selection');
              }} size="lg">
                Skip to Talents
              </Button>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <img 
              src="/image.png" 
              alt="ElevatED" 
              className="w-20 h-20 mx-auto mb-8 object-contain"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Journey!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your profile is being set up. You'll receive verification results within 24 hours. 
              Let's create your public profile to showcase your talents!
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Personalized Feed</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Discover projects matching your interests</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">👥 Join Clubs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with peers in your talent areas</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🚀 Find Mentors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get guidance from experienced professionals</p>
              </Card>
            </div>
            
            <Button size="lg" onClick={handleCompleteOnboarding} disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Create My Profile'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {renderStep()}
      </div>
    </div>
  );
};