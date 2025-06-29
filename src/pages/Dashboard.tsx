import React from 'react';
import { SkillProgress } from '../components/dashboard/SkillProgress';
import { DailyChallenges } from '../components/dashboard/DailyChallenges';
import { FeedSection } from '../components/feed/FeedSection';
import { ClubCard } from '../components/community/ClubCard';
import { MentorCard } from '../components/community/MentorCard';
import { mockClubs, mockMentors } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome back, Alex! 🎹
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
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Clubs</h3>
            <div className="space-y-4">
              {mockClubs.slice(0, 2).map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recommended Mentors</h3>
            <div className="space-y-4">
              {mockMentors.slice(0, 1).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};