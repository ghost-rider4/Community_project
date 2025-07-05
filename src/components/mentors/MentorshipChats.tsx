import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { MentorshipConnection } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentMentorships, getMentorMentorships } from '../../services/mentorshipService';
import { ChatModal } from '../chat/ChatModal';

export const MentorshipChats: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<MentorshipConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<{
    channelId: string;
    show: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = user.role === 'mentor' 
      ? getMentorMentorships(user.id, (mentorConnections) => {
          setConnections(mentorConnections);
          setIsLoading(false);
        })
      : getStudentMentorships(user.id, (studentConnections) => {
          setConnections(studentConnections);
          setIsLoading(false);
        });

    return () => unsubscribe();
  }, [user]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  const openChat = (channelId: string) => {
    setActiveChat({ channelId, show: true });
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {user.role === 'mentor' ? 'Student Chats' : 'Mentor Chats'}
        </h2>
        {connections.length > 0 && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
            {connections.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No active chats
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {user.role === 'mentor' 
                ? 'When you accept chat requests from students, they will appear here.'
                : 'When mentors accept your chat requests, they will appear here.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {connections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      name={user.role === 'mentor' ? `Student ${connection.studentId}` : `Mentor ${connection.mentorId}`}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.role === 'mentor' ? 'Student Chat' : 'Mentor Chat'}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        Connected {formatTimeAgo(connection.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openChat(connection.chatChannelId)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {activeChat && (
        <ChatModal
          open={activeChat.show}
          onClose={() => setActiveChat(null)}
          channelType="messaging"
          members={[]} // Members are already set when channel is created
          channelId={activeChat.channelId}
        />
      )}
    </div>
  );
};