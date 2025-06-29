import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Award, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Array<{talent: string, level: string, description: string}>>([]);
  const [newAchievement, setNewAchievement] = useState({
    talent: '',
    level: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const userTalents = user?.talents || [];

  const handleAddAchievement = () => {
    if (newAchievement.talent && newAchievement.level) {
      setAchievements(prev => [...prev, newAchievement]);
      setNewAchievement({ talent: '', level: '', description: '' });
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await updateUserData({
        achievements: achievements,
        verificationStatus: 'pending',
        profileSetup: false
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error saving achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
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
                {userTalents.map((talent: any) => {
                  const existingAchievement = achievements.find(a => a.talent === talent.name);
                  
                  return (
                    <div key={talent.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{talent.name}</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Level
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={existingAchievement?.level || ''}
                            onChange={(e) => {
                              const level = e.target.value;
                              const description = existingAchievement?.description || '';
                              setAchievements(prev => 
                                prev.filter(a => a.talent !== talent.name).concat([{ talent: talent.name, level, description }])
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
                            value={existingAchievement?.description || ''}
                            onChange={(e) => {
                              const description = e.target.value;
                              const level = existingAchievement?.level || '';
                              setAchievements(prev => 
                                prev.filter(a => a.talent !== talent.name).concat([{ talent: talent.name, level, description }])
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Custom Achievement */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Additional Achievement</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Talent Area
                      </label>
                      <input
                        type="text"
                        value={newAchievement.talent}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, talent: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Photography, Cooking, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Level
                      </label>
                      <select
                        value={newAchievement.level}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select level</option>
                        {skillLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Describe your achievement..."
                      />
                    </div>
                    
                    <Button onClick={handleAddAchievement} disabled={!newAchievement.talent || !newAchievement.level}>
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </Button>
                  </div>
                </div>

                {/* Display Added Achievements */}
                {achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h4>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{achievement.talent}</span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-purple-600 dark:text-purple-400">{achievement.level}</span>
                            {achievement.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveAchievement(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/talent-selection')}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Complete Setup'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};