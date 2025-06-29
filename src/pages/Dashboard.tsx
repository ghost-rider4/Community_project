import React from 'react';
import { SkillProgress } from '../components/dashboard/SkillProgress';
import { DailyChallenges } from '../components/dashboard/DailyChallenges';
import { FeedSection } from '../components/feed/FeedSection';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <SkillProgress />
          <DailyChallenges />
        </div>
      </div>
    </div>
  );
};