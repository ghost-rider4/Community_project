import React, { useState } from 'react';
import { ArrowRight, Brain, Music, Palette, Atom, Code, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

type OnboardingStep = 'welcome' | 'psychometric' | 'talents' | 'verification' | 'complete';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  
  const talents = [
    { id: 'music', name: 'Music', icon: Music, description: 'Piano, Guitar, Violin, Vocals' },
    { id: 'art', name: 'Visual Arts', icon: Palette, description: 'Painting, Drawing, Sculpture' },
    { id: 'science', name: 'Science', icon: Atom, description: 'Physics, Chemistry, Biology' },
    { id: 'technology', name: 'Technology', icon: Code, description: 'Programming, AI, Robotics' }
  ];
  
  const handleTalentToggle = (talentId: string) => {
    setSelectedTalents(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };
  
  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full w-20 h-20 mx-auto mb-8 flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to GiftedHub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your journey to connect with like-minded peers and expert mentors starts here. 
              Let's discover your unique talents and build your personalized learning experience.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Personalized Experience</h3>
                <p className="text-gray-600 dark:text-gray-400">Take our psychometric assessment to get tailored recommendations</p>
              </Card>
              <Card className="p-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🚀 Skip & Explore</h3>
                <p className="text-gray-600 dark:text-gray-400">Jump straight to talent selection if you know what interests you</p>
              </Card>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setStep('psychometric')} size="lg">
                Take Assessment
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => setStep('talents')} size="lg">
                Skip to Talents
              </Button>
            </div>
          </div>
        );
        
      case 'psychometric':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Discover Your True Potential</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This 15-minute assessment will help us understand your aspirations and recommend the best path forward.
              </p>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      What drives you most when learning something new?
                    </h3>
                    <div className="space-y-3">
                      {[
                        'The challenge of mastering complex concepts',
                        'Creating something beautiful or meaningful',
                        'Solving real-world problems',
                        'Connecting with others who share my interests'
                      ].map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input type="radio" name="motivation" className="text-purple-600" />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      How do you prefer to learn?
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Through hands-on experimentation',
                        'By studying theory and concepts first',
                        'In collaboration with peers',
                        'With guidance from mentors'
                      ].map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input type="radio" name="learning" className="text-purple-600" />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('welcome')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep('talents')}>
                Continue Assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'talents':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Talents</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select the areas you're passionate about. You can always add more later.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {talents.map((talent) => {
                const Icon = talent.icon;
                const isSelected = selectedTalents.includes(talent.id);
                
                return (
                  <Card 
                    key={talent.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => handleTalentToggle(talent.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          isSelected 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{talent.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{talent.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('psychometric')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={() => setStep('verification')}
                disabled={selectedTalents.length === 0}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'verification':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Showcase Your Skills</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload examples of your work to help us understand your current level. This helps us match you with the right peers and mentors.
              </p>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {selectedTalents.map((talentId) => {
                    const talent = talents.find(t => t.id === talentId);
                    return (
                      <div key={talentId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{talent?.name}</h3>
                        
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                          <div className="space-y-4">
                            <div className="text-gray-500 dark:text-gray-400">
                              <p>Drop files here or click to browse</p>
                              <p className="text-sm">Supported: Images, Videos, Documents (Max 50MB)</p>
                            </div>
                            <Button variant="outline">
                              Choose Files
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-700" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              I'm just starting out - mark me as a beginner
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('talents')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep('complete')}>
                Complete Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full w-20 h-20 mx-auto mb-8 flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Journey!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your profile is being set up. You'll receive verification results within 24 hours. 
              In the meantime, explore the platform and connect with your community!
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
            
            <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
              Enter GiftedHub
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