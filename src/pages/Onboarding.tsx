import React, { useState } from 'react';
import { ArrowRight, Music, Palette, Atom, Code, ArrowLeft, Brain, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

type OnboardingStep = 'welcome' | 'psychometric' | 'talents' | 'achievements' | 'complete';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Array<{talent: string, level: string, description: string}>>([]);
  const [psychometricSkipped, setPsychometricSkipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useAuth();
  const navigate = useNavigate();
  
  const talents = [
    { id: 'music', name: 'Music', icon: Music, description: 'Piano, Guitar, Violin, Vocals' },
    { id: 'art', name: 'Visual Arts', icon: Palette, description: 'Painting, Drawing, Sculpture' },
    { id: 'science', name: 'Science', icon: Atom, description: 'Physics, Chemistry, Biology' },
    { id: 'technology', name: 'Technology', icon: Code, description: 'Programming, AI, Robotics' }
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const handleTalentToggle = (talentId: string) => {
    setSelectedTalents(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  const handleAddAchievement = (talent: string, level: string, description: string) => {
    setAchievements(prev => [...prev, { talent, level, description }]);
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      const talentData = selectedTalents.map(talentId => {
        const talent = talents.find(t => t.id === talentId);
        const achievement = achievements.find(a => a.talent === talentId);
        return {
          id: talentId,
          name: talent?.name || talentId,
          category: talent?.name || talentId,
          level: achievement?.level || 'Beginner'
        };
      });

      await updateUserData({
        talents: talentData,
        achievements: achievements,
        psychometricCompleted: !psychometricSkipped,
        onboardingCompleted: true,
        verificationStatus: 'pending'
      });

      navigate('/profile');
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
              <Button onClick={() => setStep('psychometric')} size="lg">
                Take Assessment
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => {
                setPsychometricSkipped(true);
                setStep('talents');
              }} size="lg">
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
              <Button variant="outline" onClick={() => setStep(psychometricSkipped ? 'welcome' : 'psychometric')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={() => setStep('achievements')}
                disabled={selectedTalents.length === 0}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'achievements':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Add Your Achievements</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your current level in each talent area for verification purposes.
              </p>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {selectedTalents.map((talentId) => {
                    const talent = talents.find(t => t.id === talentId);
                    const existingAchievement = achievements.find(a => a.talent === talentId);
                    
                    return (
                      <div key={talentId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{talent?.name}</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Level
                            </label>
                            <select
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              defaultValue={existingAchievement?.level || ''}
                              onChange={(e) => {
                                const level = e.target.value;
                                const description = existingAchievement?.description || '';
                                setAchievements(prev => 
                                  prev.filter(a => a.talent !== talentId).concat([{ talent: talentId, level, description }])
                                );
                              }}
                            >
                              <option value="">Select your level</option>
                              {skillLevels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Description (Optional)
                            </label>
                            <textarea
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                              placeholder="Describe your experience, achievements, or projects in this area..."
                              defaultValue={existingAchievement?.description || ''}
                              onChange={(e) => {
                                const description = e.target.value;
                                const level = existingAchievement?.level || '';
                                setAchievements(prev => 
                                  prev.filter(a => a.talent !== talentId).concat([{ talent: talentId, level, description }])
                                );
                              }}
                            />
                          </div>
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