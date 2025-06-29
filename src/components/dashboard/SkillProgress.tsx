import React from 'react';
import { Trophy, Star, Target } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { mockStudent } from '../../utils/mockData';

export const SkillProgress: React.FC = () => {
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
              <p className="text-sm text-gray-600 dark:text-gray-400">{mockStudent.points} total points</p>
            </div>
          </div>
          <Badge variant={mockStudent.tier}>
            {mockStudent.tier.charAt(0).toUpperCase() + mockStudent.tier.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to Gold</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{tierProgress}%</span>
            </div>
            <ProgressBar progress={tierProgress} />
          </div>
          
          {mockStudent.talents.map((talent, index) => (
            <div key={talent.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
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
  );
};