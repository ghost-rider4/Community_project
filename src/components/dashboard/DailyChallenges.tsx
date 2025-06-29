import React from 'react';
import { Zap, Clock, Users, Target } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

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
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            No challenges available
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Daily challenges are coming soon! Check back later for exciting tasks.
          </p>
          <Button size="sm" variant="outline">
            Get Notified
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};