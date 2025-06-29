import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, TrendingUp, Award, Zap, Crown, Medal, Gift, Calendar, Users, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';

export const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'rewards'>('overview');
  const [timeSpent, setTimeSpent] = useState(0);
  const { user } = useAuth();

  // Real-time progress tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize user at Level 1 with 0 points if new
  const userProgress = {
    level: user?.level || 1,
    points: user?.points || 0,
    experience: user?.experience || 0,
    nextLevelExp: user?.nextLevelExp || 100,
    tier: user?.tier || 'Bronze',
    achievements: user?.achievements || [],
    streaks: user?.streaks || [],
    skillsMastered: user?.talents?.length || 0,
    timeSpent: Math.floor(timeSpent / 60) // Convert to minutes
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Real-time Progress Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              Level {userProgress.level}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {userProgress.points.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {userProgress.skillsMastered}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Skills Mastered</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {userProgress.timeSpent}m
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Level {userProgress.level}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Experience Points</p>
              </div>
            </div>
            <Badge variant={userProgress.tier.toLowerCase() as any} className="text-sm">
              {userProgress.tier}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress to Level {userProgress.level + 1}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userProgress.experience}/{userProgress.nextLevelExp} XP
              </span>
            </div>
            <ProgressBar 
              progress={(userProgress.experience / userProgress.nextLevelExp) * 100} 
              color="purple" 
            />
          </div>
        </CardContent>
      </Card>

      {/* User Talents */}
      {user?.talents && user.talents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Your Talents</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.talents.map((talent: any, index: number) => (
                <div key={talent.id || index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{talent.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{talent.category}</p>
                    </div>
                  </div>
                  <Badge variant="default">{talent.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="text-center py-16">
        <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No achievements yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start completing challenges and projects to earn your first achievements!
        </p>
        <Button>Explore Challenges</Button>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="text-center py-16">
        <Crown className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Leaderboard coming soon
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Compete with other talented students and see where you rank!
        </p>
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="text-center py-16">
        <Gift className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Rewards system coming soon
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Earn points and unlock amazing rewards for your achievements!
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Progress</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your achievements, compete with peers, and unlock amazing rewards
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'achievements' && renderAchievements()}
      {activeTab === 'leaderboard' && renderLeaderboard()}
      {activeTab === 'rewards' && renderRewards()}
    </div>
  );
};