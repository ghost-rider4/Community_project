import React from 'react';
import { Star, MapPin, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Mentor } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { ChatModal } from '../chat/ChatModal';
import { ChatRequestModal } from '../mentors/ChatRequestModal';

interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const { user } = useAuth();
  const [chatRequestOpen, setChatRequestOpen] = React.useState(false);

  return (
    <Card hover>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <Avatar name={mentor.name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">{mentor.name}</h3>
              {mentor.availability && (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{mentor.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{mentor.studentsCount} students</span>
              </div>
              {mentor.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{mentor.location}</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{mentor.experience}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="default" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="text-sm">
            View Profile
          </Button>
          {user?.role === 'student' && (
            <Button 
              variant="primary" 
              size="sm" 
              className="text-sm" 
              onClick={() => setChatRequestOpen(true)}
            >
              Request Chat
            </Button>
          )}
          <ChatRequestModal
            open={chatRequestOpen}
            onClose={() => setChatRequestOpen(false)}
            mentor={mentor}
          />
        </div>
      </CardContent>
    </Card>
  );
};