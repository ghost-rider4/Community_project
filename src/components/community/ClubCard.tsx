import React from 'react';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Club } from '../../types/clubs';
import { ChatModal } from '../chat/ChatModal';
import { useAuth } from '../../contexts/AuthContext';
import { joinClub, leaveClub, deleteClub } from '../../services/clubService';

interface ClubCardProps {
  club: Club;
  onOpenChat?: (club: Club) => void;
  onOpenDetails?: (club: Club) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onOpenChat, onOpenDetails }) => {
  const { user } = useAuth();
  const isMember = user && club.members && club.members.includes(user.id);
  const isLeader = user && club.leaderId === user.id;

  const handleJoinClub = async () => {
    if (user) {
      await joinClub(club.id, user.id);
    }
  };

  const handleLeaveClub = async () => {
    if (user) {
      await leaveClub(club.id, user.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      await deleteClub(club.id);
    }
  };

  return (
    <div onClick={() => onOpenDetails && onOpenDetails(club)} className="cursor-pointer">
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
                <span>{club.members?.length || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{club.recentActivity}</p>
          </div>
          {!isMember && (
            <Button variant="outline" size="sm" className="w-full" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleJoinClub(); }}>
              Join Club
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {isMember && (
            <Button variant="secondary" size="sm" className="w-full mt-2" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onOpenChat && onOpenChat(club); }}>
              Open Club Chat
            </Button>
          )}
          {isLeader && (
            <Button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(e); }}
              variant="secondary"
              size="sm"
              className="w-full mt-2 bg-gradient-to-r from-red-500 to-red-800 text-white border-none"
            >
              Delete Club
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};