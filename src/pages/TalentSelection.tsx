import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export const TalentSelection: React.FC = () => {
  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  const [customTalent, setCustomTalent] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useAuth();
  const navigate = useNavigate();

  const talentCategories = [
    {
      id: 'art-design',
      name: 'Art & Design',
      icon: '🎨',
      description: 'Visual arts, graphic design, illustration'
    },
    {
      id: 'music',
      name: 'Music',
      icon: '🎵',
      description: 'Instruments, vocals, composition, production'
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      description: 'Athletics, team sports, individual sports'
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: '✍️',
      description: 'Creative writing, journalism, poetry'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Programming, AI/ML, robotics, web development'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      icon: '👑',
      description: 'Team management, project leadership, mentoring'
    },
    {
      id: 'public-speaking',
      name: 'Public Speaking',
      icon: '🎤',
      description: 'Presentations, debate, communication'
    },
    {
      id: 'languages',
      name: 'Languages',
      icon: '🌍',
      description: 'Foreign languages, linguistics, translation'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: '🔢',
      description: 'Pure math, applied math, statistics'
    },
    {
      id: 'sciences',
      name: 'Sciences',
      icon: '🔬',
      description: 'Physics, chemistry, biology, research'
    },
    {
      id: 'performing-arts',
      name: 'Performing Arts',
      icon: '🎭',
      description: 'Theater, dance, performance, acting'
    },
    {
      id: 'crafts',
      name: 'Crafts',
      icon: '🛠️',
      description: 'Woodworking, pottery, jewelry, handmade items'
    }
  ];

  const handleTalentToggle = (talentId: string) => {
    setSelectedTalents(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  const handleAddCustomTalent = () => {
    if (customTalent.trim() && !selectedTalents.includes(customTalent.trim())) {
      setSelectedTalents(prev => [...prev, customTalent.trim()]);
      setCustomTalent('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomTalent = (talent: string) => {
    setSelectedTalents(prev => prev.filter(t => t !== talent));
  };

  const handleContinue = async () => {
    if (selectedTalents.length === 0) return;

    setIsLoading(true);
    try {
      const talentData = selectedTalents.map(talentId => {
        const category = talentCategories.find(t => t.id === talentId);
        return {
          id: talentId,
          name: category?.name || talentId,
          category: category?.name || 'Other',
          level: 'Beginner'
        };
      });

      await updateUserData({
        talents: talentData,
        talentsSelected: true
      });

      navigate('/psychometric-assessment');
    } catch (error) {
      console.error('Error saving talents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const customTalents = selectedTalents.filter(talent => 
    !talentCategories.some(category => category.id === talent)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Select Your Talents
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Choose the areas where you excel or want to grow
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              You can select multiple talents and add custom ones. This helps us personalize your experience.
            </p>
          </div>

          {/* Talent Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {talentCategories.map((talent) => {
              const isSelected = selectedTalents.includes(talent.id);
              
              return (
                <Card 
                  key={talent.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105' 
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                  onClick={() => handleTalentToggle(talent.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{talent.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {talent.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {talent.description}
                    </p>
                    {isSelected && (
                      <div className="mt-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-medium">
                          ✓ Selected
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Others/Custom Option */}
            <Card 
              className="cursor-pointer transition-all duration-200 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
              onClick={() => setShowCustomInput(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">➕</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Others
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your own custom talent area
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Custom Talent Input */}
          {showCustomInput && (
            <Card className="mb-8 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Custom Talent</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customTalent}
                    onChange={(e) => setCustomTalent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTalent()}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your talent area (e.g., Photography, Cooking, etc.)"
                  />
                  <Button onClick={handleAddCustomTalent} disabled={!customTalent.trim()}>
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => setShowCustomInput(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Custom Talents */}
          {customTalents.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Custom Talents</h3>
                <div className="flex flex-wrap gap-3">
                  {customTalents.map((talent) => (
                    <div key={talent} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
                      <span>{talent}</span>
                      <button
                        onClick={() => handleRemoveCustomTalent(talent)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Count */}
          {selectedTalents.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTalents.length} talent{selectedTalents.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/onboarding')}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={selectedTalents.length === 0 || isLoading}
              size="lg"
            >
              {isLoading ? 'Saving...' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};