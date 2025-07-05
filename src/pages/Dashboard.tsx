import React, { useState, useEffect } from 'react';
import { SkillProgress } from '../components/dashboard/SkillProgress';
import { DailyChallenges } from '../components/dashboard/DailyChallenges';
import { FeedSection } from '../components/feed/FeedSection';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { ChatRequestManagement } from '../components/mentors/ChatRequestManagement';
import { MentorshipChats } from '../components/mentors/MentorshipChats';
import { MentorProfiles } from '../components/dashboard/MentorProfiles';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showPsychoBanner, setShowPsychoBanner] = useState(false);
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);

  useEffect(() => {
    if (user && user.role === 'student' && !user.psychometricCompleted) {
      // Show until user dismisses (persists across sign-ins)
      if (localStorage.getItem('psychometricBannerDismissed') !== 'true') {
        setShowPsychoBanner(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'student' && (!(user as any)?.achievements || (user as any)?.achievements.length === 0)) {
      setShowAchievementBanner(true);
    } else {
      setShowAchievementBanner(false);
    }
  }, [user]);

  const handleDismissBanner = () => {
    setShowPsychoBanner(false);
    localStorage.setItem('psychometricBannerDismissed', 'true');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingLeft: 80 }}>
      {/* Achievement Banner */}
      {showAchievementBanner && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-center justify-between">
          <div className="text-yellow-800 dark:text-yellow-200">
            <strong>Add your Achievements!</strong> Complete your profile by submitting your achievements for verification.
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => window.location.href = '/achievements'}>Add Achievements</Button>
          </div>
        </div>
      )}
      
      {/* Psychometric Banner */}
      {showPsychoBanner && (
        <div className="mb-6 p-4 bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 rounded-lg flex items-center justify-between">
          <div className="text-purple-800 dark:text-purple-200">
            <strong>Complete your Psychometric Assessment!</strong> Get personalized recommendations for your learning journey.
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => window.location.href = '/psychometric-assessment'}>Take Test</Button>
            <button onClick={handleDismissBanner} className="ml-2 text-purple-800 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400 text-lg">&times;</button>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name}! 🎹
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your learning journey? Here's what's happening today.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <FeedSection />
          {/* Show mentor profiles for students */}
          {user?.role === 'student' && <MentorProfiles />}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <SkillProgress />
          <DailyChallenges />
          
          {/* Mentor Chat Management */}
          {user?.role === 'mentor' && <ChatRequestManagement />}
          
          {/* Active Mentorship Chats */}
          <MentorshipChats />
        </div>
      </div>
    </div>
  );
};