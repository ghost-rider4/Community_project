import React from 'react';
import { Zap, Clock, Users } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockChallenges } from '../../utils/mockData';

export const DailyChallenges: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Daily Challenges</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {mockChallenges.map((challenge) => (
            <div key={challenge.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-purple-200 dark:hover:border-purple-600 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{challenge.title}</h4>
                <Badge variant="default">{challenge.points} pts</Badge>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {challenge.deadline.toDateString() === new Date().toDateString() 
                        ? 'Today' 
                        : challenge.deadline.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants} joined</span>
                  </div>
                </div>
                
                <Button size="sm">
                  Start Challenge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};