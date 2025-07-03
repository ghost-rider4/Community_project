import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Award, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Array<{talent: string, level: string, description: string, primary: boolean, secondary: boolean, file: File | null}>>([]);
  const [newAchievement, setNewAchievement] = useState({
    talent: '',
    level: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [primaryTalent, setPrimaryTalent] = useState<string>('');
  const [secondaryTalents, setSecondaryTalents] = useState<string[]>([]);
  const [fileUploads, setFileUploads] = useState<{ [talent: string]: File | null }>({});
  const [isOtherTalent, setIsOtherTalent] = useState(false);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const talentOptions = [
    { id: 'art-design', name: 'Art & Design' },
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'writing', name: 'Writing' },
    { id: 'technology', name: 'Technology' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'public-speaking', name: 'Public Speaking' },
    { id: 'languages', name: 'Languages' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'sciences', name: 'Sciences' },
    { id: 'performing-arts', name: 'Performing Arts' },
    { id: 'crafts', name: 'Crafts' },
    { id: 'other', name: 'Other' },
  ];

  const handleAddAchievement = () => {
    if (newAchievement.talent && newAchievement.level) {
      setAchievements(prev => [...prev, { ...newAchievement, primary: primaryTalent === newAchievement.talent, secondary: secondaryTalents.includes(newAchievement.talent), file: fileUploads[newAchievement.talent] || null }]);
      setNewAchievement({ talent: '', level: '', description: '' });
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const talents = achievements.map(a => ({
        name: a.talent,
        level: a.level,
        primary: primaryTalent === a.talent,
        secondary: secondaryTalents.includes(a.talent)
      }));
      await updateUserData({
        achievements: achievements.map(a => ({ ...a, primary: primaryTalent === a.talent, secondary: secondaryTalents.includes(a.talent), file: fileUploads[a.talent] || null })),
        talents,
        verificationStatus: 'pending',
        profileSetup: true
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error saving achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.achievements) {
            setAchievements(data.achievements);
            const primary = data.achievements.find((a: any) => a.primary)?.talent || '';
            setPrimaryTalent(primary);
            setSecondaryTalents(data.achievements.filter((a: any) => a.secondary).map((a: any) => a.talent));
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAchievements();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-200 text-center font-medium">
            Note: You can only add achievements once throughout the app, as your submission will be sent for verification. Please fill this section carefully and ensure all information is accurate before submitting.
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Add Your Achievements</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your current level in each talent area for verification purposes.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Add Achievement Form (always visible) */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Achievement</h3>
                  <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">Primary</span> means your main focus or stream (e.g., what you want to pursue in college). <span className="font-semibold text-purple-700 dark:text-purple-300">Secondary</span> means other talents you are skilled in but are not your main focus. You can select only one primary, but multiple secondaries.
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="primarySecondary-custom"
                        checked={primaryTalent === newAchievement.talent}
                        onChange={() => {
                          setPrimaryTalent(newAchievement.talent);
                          setSecondaryTalents(prev => prev.filter(t => t !== newAchievement.talent));
                        }}
                        disabled={!!primaryTalent && primaryTalent !== newAchievement.talent}
                      />
                      <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Primary</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={secondaryTalents.includes(newAchievement.talent)}
                        onChange={() => {
                          if (secondaryTalents.includes(newAchievement.talent)) {
                            setSecondaryTalents(prev => prev.filter(t => t !== newAchievement.talent));
                          } else {
                            setSecondaryTalents(prev => [...prev, newAchievement.talent]);
                            if (primaryTalent === newAchievement.talent) setPrimaryTalent('');
                          }
                        }}
                        disabled={primaryTalent === newAchievement.talent}
                      />
                      <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Secondary</span>
                    </label>
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Talent Area
                      </label>
                    <select
                      value={talentOptions.some(opt => opt.name === newAchievement.talent) ? newAchievement.talent : (isOtherTalent ? 'Other' : '')}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setIsOtherTalent(true);
                          setNewAchievement(prev => ({ ...prev, talent: '' }));
                        } else {
                          setIsOtherTalent(false);
                          setNewAchievement(prev => ({ ...prev, talent: val }));
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select talent</option>
                      {talentOptions.map(opt => (
                        <option key={opt.id} value={opt.name}>{opt.name}</option>
                      ))}
                    </select>
                    {isOtherTalent && (
                      <input
                        type="text"
                        value={newAchievement.talent}
                        onChange={e => setNewAchievement(prev => ({ ...prev, talent: e.target.value }))}
                        className="w-full mt-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your custom talent"
                      />
                    )}
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
                  {/* File Upload for custom achievement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Attach Proof (Image, Video, etc.)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={e => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        setFileUploads(prev => ({ ...prev, [newAchievement.talent]: file }));
                      }}
                    />
                    {fileUploads[newAchievement.talent] && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-700 dark:text-gray-300">{fileUploads[newAchievement.talent]?.name}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-xs"
                          onClick={() => setFileUploads(prev => ({ ...prev, [newAchievement.talent]: null }))}
                        >Remove</button>
                      </div>
                    )}
                  </div>
                    <Button onClick={handleAddAchievement} disabled={!newAchievement.talent || !newAchievement.level}>
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </Button>
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

                {/* Primary Achievement Badges */}
                {achievements.filter(a => a.primary).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {achievements.filter(a => a.primary).map((achievement, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-semibold">
                        {achievement.talent} - {achievement.level}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};