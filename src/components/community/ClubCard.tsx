import React from 'react';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Club } from '../../types';

interface ClubCardProps {
  club: Club;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{club.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{club.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{club.memberCount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-green-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{club.recentActivity}</p>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          Join Club
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};