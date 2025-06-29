import React from 'react';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Opportunity } from '../../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{opportunity.title}</h3>
            <p className="text-purple-600 dark:text-purple-400 font-medium">{opportunity.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={opportunity.type === 'internship' ? 'silver' : 'default'}>
              {opportunity.type}
            </Badge>
            {opportunity.isPaid && (
              <Badge variant="gold">
                <DollarSign className="w-3 h-3 mr-1" />
                Paid
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{opportunity.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Due {opportunity.deadline.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.talents.map((talent) => (
            <span 
              key={talent}
              className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
            >
              {talent}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            Apply Now
          </Button>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};