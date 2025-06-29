import React, { useState } from 'react';
import { Trophy, Star, Target, TrendingUp, Award, Zap, Crown, Medal, Gift, Calendar, Users, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { mockStudent, mockLeaderboard, mockAchievements, mockTierBenefits, mockLevelRewards } from '../utils/mockData';

export const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'rewards'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level & Experience */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Level {mockStudent.level}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience Points</p>
                </div>
              </div>
              <Badge variant={mockStudent.tier} className="text-sm">
                {mockStudent.tier.charAt(0).toUpperCase() + mockStudent.tier.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress to Level {mockStudent.level + 1}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {mockStudent.experience}/{mockStudent.nextLevelExp} XP
                </span>
              </div>
              <ProgressBar 
                progress={(mockStudent.experience / mockStudent.nextLevelExp) * 100} 
                color="purple" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Points</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lifetime Achievement</p>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mockStudent.points.toLocaleString()}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              +125 this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Active Streaks</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStudent.streaks.map((streak) => (
              <div key={streak.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {streak.type.replace('_', ' ')}
                  </span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {streak.count}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Best: {streak.maxStreak}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {mockStudent.tier.charAt(0).toUpperCase() + mockStudent.tier.slice(1)} Tier Benefits
            </h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTierBenefits
              .filter(benefit => benefit.tier === mockStudent.tier)
              .map((benefit) => (
                <div key={benefit.id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl">{benefit.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{benefit.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Unlocked', value: mockStudent.achievements.filter(a => a.unlockedAt).length, icon: Award },
          { label: 'In Progress', value: mockStudent.achievements.filter(a => !a.unlockedAt && a.progress).length, icon: Target },
          { label: 'Legendary', value: mockStudent.achievements.filter(a => a.rarity === 'legendary' && a.unlockedAt).length, icon: Crown },
          { label: 'This Month', value: 3, icon: Calendar }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAchievements.map((achievement) => {
          const isUnlocked = achievement.unlockedAt;
          const hasProgress = achievement.progress !== undefined;
          
          return (
            <Card key={achievement.id} className={`${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {achievement.title}
                      </h4>
                      <Badge 
                        variant={achievement.rarity === 'legendary' ? 'gold' : achievement.rarity === 'epic' ? 'diamond' : 'default'}
                        className="text-xs"
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-2 ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    
                    {hasProgress && !isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <ProgressBar 
                          progress={(achievement.progress! / achievement.maxProgress!) * 100} 
                          color="orange"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        +{achievement.points} points
                      </span>
                      {isUnlocked && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Unlocked {achievement.unlockedAt!.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      {/* Leaderboard Filters */}
      <div className="flex flex-wrap gap-2">
        {['Global', 'This Week', 'This Month', 'My Talents', 'My Age Group'].map((filter) => (
          <Button key={filter} variant="outline" size="sm">
            {filter}
          </Button>
        ))}
      </div>

      {/* Current User Rank */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold">
              #12
            </div>
            <Avatar name={mockStudent.name} size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{mockStudent.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mockStudent.points.toLocaleString()} points • Level {mockStudent.level}
              </p>
            </div>
            <Badge variant={mockStudent.tier}>
              {mockStudent.tier.charAt(0).toUpperCase() + mockStudent.tier.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Global Leaderboard</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {mockLeaderboard.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {index < 3 ? (
                    index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                  ) : (
                    entry.rank
                  )}
                </div>
                
                <Avatar name={entry.name} size="sm" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{entry.name}</h4>
                    <Badge variant={entry.tier} className="text-xs">
                      {entry.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.talents.join(', ')}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {entry.points.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    +{entry.weeklyGain} this week
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      {/* Next Level Rewards */}
      <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Next Level Rewards</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {mockLevelRewards
            .filter(reward => reward.level === mockStudent.level + 1)
            .map((reward) => (
              <div key={reward.level} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{reward.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      Level {reward.level}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {reward.points} XP needed
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reward.rewards.map((rewardItem, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <Gift className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{rewardItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* All Level Rewards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Level Progression Rewards</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {mockLevelRewards.map((reward) => {
              const isUnlocked = mockStudent.level >= reward.level;
              const isCurrent = mockStudent.level + 1 === reward.level;
              
              return (
                <div key={reward.level} className={`p-4 rounded-lg border-2 ${
                  isCurrent ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                  isUnlocked ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' :
                  'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isUnlocked ? 'bg-purple-600 text-white' :
                        isCurrent ? 'bg-green-500 text-white' :
                        'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {reward.level}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isUnlocked || isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {reward.title}
                        </h4>
                        <p className={`text-sm ${isUnlocked || isCurrent ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                          {reward.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isUnlocked && <Badge variant="default" className="text-xs">Unlocked</Badge>}
                      {isCurrent && <Badge variant="default" className="text-xs bg-green-100 text-green-800">Next</Badge>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {reward.rewards.map((rewardItem, index) => (
                      <div key={index} className={`flex items-center gap-2 p-2 rounded ${
                        isUnlocked ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Gift className={`w-3 h-3 ${isUnlocked ? 'text-purple-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isUnlocked || isCurrent ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                          {rewardItem}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
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