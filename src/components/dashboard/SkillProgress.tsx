import React from 'react';
import { Trophy, Star, Target } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';

export const SkillProgress: React.FC = () => {
  const { user } = useAuth();
  const tierProgress = 75; // Mock progress to next tier
  
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Skill Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.points || 0} total points</p>
            </div>
          </div>
          <Badge variant={user?.tier?.toLowerCase() as any || 'bronze'}>
            {user?.tier || 'Bronze'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to {user?.tier === 'Bronze' ? 'Silver' : 'Gold'}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{tierProgress}%</span>
            </div>
            <ProgressBar progress={tierProgress} />
          </div>
          
          {user?.talents && user.talents.length > 0 ? (
            user.talents.map((talent: any, index: number) => (
              <div key={talent.id || index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{talent.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{talent.category}</p>
                  </div>
                </div>
                <Badge variant="default">{talent.level}</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Target className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No talents selected yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};