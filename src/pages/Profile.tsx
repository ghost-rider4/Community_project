import React, { useState, useEffect } from 'react';
import { Edit, Plus, X, Award, Calendar, MapPin, Link as LinkIcon, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

type ProfileDataType = {
  bio: string;
  location: string;
  website: string;
  achievements: any[];
  experiences: any[];
  skills: any[];
};

export const Profile: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPsychoReport, setShowPsychoReport] = useState(false);
  const [profileData, setProfileData] = useState<ProfileDataType>({
    bio: '',
    location: '',
    website: '',
    achievements: [],
    experiences: [],
    skills: (user as any)?.talents?.map((t: any) => t.name) || []
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    organization: '',
    period: '',
    description: ''
  });
  const [showAddExperience, setShowAddExperience] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData(prev => ({
            ...prev,
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            achievements: data.achievements || [],
            experiences: data.experiences || [],
            skills: Array.isArray(data.talents)
              ? (typeof data.talents[0] === 'object'
                  ? data.talents
                  : data.talents.map((name: string) => ({ name, level: '' })))
              : [],
          }));
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
    // Only run when user changes
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserData({
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        achievements: profileData.achievements,
        experiences: profileData.experiences,
      });
    setIsEditing(false);
    } catch (error) {
      alert('Failed to save profile. Please try again.');
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfileData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.organization) {
      setProfileData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...newExperience, id: Date.now().toString() }]
      }));
      setNewExperience({ title: '', organization: '', period: '', description: '' });
      setShowAddExperience(false);
    }
  };

  const removeExperience = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Public Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage how others see your profile and achievements
            </p>
          </div>
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? 'primary' : 'outline'}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Psychometric Test Section */}
      {(user as any)?.role === 'student' && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Psychometric Assessment</h2>
                {!(user as any)?.psychometricCompleted ? (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Take the assessment to get personalized recommendations for your learning journey.</p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">You have completed the assessment. View your personalized recommendations below.</p>
                )}
              </div>
              <div>
                {!(user as any)?.psychometricCompleted ? (
                  <Button onClick={() => navigate('/psychometric-assessment')}>Take Psychometric Test</Button>
                ) : (
                  <Button variant="outline" onClick={() => setShowPsychoReport(v => !v)}>
                    {showPsychoReport ? 'Hide Recommendations' : 'View Recommendations'}
                  </Button>
                )}
              </div>
            </div>
            {/* Show recommendations if completed and toggled */}
            {(user as any)?.psychometricCompleted && showPsychoReport && (user as any)?.psychometricResults && (
              <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">Your Personalized Recommendations</h3>
                <div className="mb-2">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Strengths:</span>
                  <ul className="list-disc ml-6">
                    {(user as any)?.psychometricResults?.report?.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-purple-700 dark:text-purple-300">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Recommendations:</span>
                  <ul className="list-disc ml-6">
                    {(user as any)?.psychometricResults?.report?.recommendations?.map((r: string, i: number) => (
                      <li key={i} className="text-purple-700 dark:text-purple-300">{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2 text-purple-700 dark:text-purple-300">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Learning Style:</span> <span className="text-purple-700 dark:text-purple-300">{(user as any)?.psychometricResults?.report?.learningStyle}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Career Suggestions:</span>
                  <ul className="list-disc ml-6">
                    {(user as any)?.psychometricResults?.report?.careerSuggestions?.map((c: string, i: number) => (
                      <li key={i} className="text-purple-700 dark:text-purple-300">{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2 text-purple-700 dark:text-purple-300">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Personality Type:</span> <span className="text-purple-700 dark:text-purple-300">{(user as any)?.psychometricResults?.report?.personalityType}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar name={user.name} size="lg" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-purple-500 outline-none"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-purple-500 outline-none"
                        placeholder="Your website"
                      />
                    ) : (
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder="Tell others about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{profileData.bio}</p>
                  )}
                </div>

                {/* Talents */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((talent: any, idx: number) => (
                      <Badge key={talent.name || idx} variant="default">
                        {talent.name ? `${talent.name} - ${talent.level}` : talent}
                    </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No talents selected yet</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(user as any)?.points || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(user as any)?.level || 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(user as any)?.achievements?.filter((a: any) => a.unlockedAt).length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {profileData.achievements?.length > 0 ? (
                profileData.achievements.map((ach: any, idx: number) => (
                  <div key={idx} className="p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">{ach.talent}</span>
                      <span className="ml-2 px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">{ach.level}</span>
                    </div>
                    {ach.description && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">{ach.description}</p>
                  )}
                </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No achievements added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={() => setShowAddExperience(true)}>
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {profileData.experiences.map((experience) => (
                <div key={experience.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{experience.title}</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">{experience.organization}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{experience.period}</p>
                      <p className="text-gray-700 dark:text-gray-300">{experience.description}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeExperience(experience.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-4"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isEditing && showAddExperience && (
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Position title"
                  />
                  <input
                    type="text"
                    value={newExperience.organization}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Organization"
                  />
                  <input
                    type="text"
                    value={newExperience.period}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Time period (e.g., 2023 - Present)"
                  />
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={2}
                    placeholder="Description of your role and achievements"
                  />
                  <div className="flex gap-2">
                    <Button onClick={addExperience} size="sm">
                      Add Experience
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddExperience(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};