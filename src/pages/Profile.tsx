import React, { useState } from 'react';
import { Edit, Plus, X, Award, Calendar, MapPin, Link as LinkIcon, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Passionate about learning and exploring new talents.',
    location: 'San Francisco, CA',
    website: 'https://myportfolio.dev',
    achievements: [
      'Completed first project upload',
      'Joined the community',
      'Started learning journey'
    ],
    experiences: [
      {
        id: '1',
        title: 'Student',
        organization: 'ElevatED Community',
        period: '2024 - Present',
        description: 'Active member of the gifted learning community'
      }
    ],
    skills: user?.talents?.map(t => t.name) || []
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    organization: '',
    period: '',
    description: ''
  });
  const [showAddExperience, setShowAddExperience] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', profileData);
    setIsEditing(false);
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
                  {user.talents?.map((talent) => (
                    <Badge key={talent.id} variant="default">
                      {talent.name} - {talent.level}
                    </Badge>
                  )) || (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No talents selected yet</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.points || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.level || 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.achievements?.filter((a: any) => a.unlockedAt).length || 0}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={() => setNewAchievement('')}>
                  <Plus className="w-4 h-4" />
                  Add Achievement
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-white">{achievement}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add a new achievement..."
                  />
                  <Button onClick={addAchievement} size="sm">
                    Add
                  </Button>
                </div>
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