import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, X, Clock, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { ChatRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useStreamChat } from '../../contexts/StreamChatContext';
import { 
  getMentorChatRequests, 
  acceptChatRequest, 
  declineChatRequest 
} from '../../services/mentorshipService';
import { ChatModal } from '../chat/ChatModal';

export const ChatRequestManagement: React.FC = () => {
  const { user } = useAuth();
  const streamChat = useStreamChat();
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [activeChat, setActiveChat] = useState<{
    channelId: string;
    show: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'mentor') return;

    const unsubscribe = getMentorChatRequests(user.id, (chatRequests) => {
      setRequests(chatRequests);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptRequest = async (request: ChatRequest) => {
    if (!streamChat?.chatClient) return;

    setProcessingRequests(prev => new Set(prev).add(request.id));
    
    try {
      const channelId = await acceptChatRequest(request.id, streamChat.chatClient);
      
      // Show the chat modal
      setActiveChat({ channelId, show: true });
    } catch (error) {
      console.error('Error accepting chat request:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleDeclineRequest = async (request: ChatRequest) => {
    setProcessingRequests(prev => new Set(prev).add(request.id));
    
    try {
      await declineChatRequest(request.id);
    } catch (error) {
      console.error('Error declining chat request:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (user?.role !== 'mentor') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chat Requests
        </h2>
        {requests.length > 0 && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
            {requests.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No chat requests
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              When students request to chat with you, they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar name={request.studentName} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {request.studentName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(request.createdAt)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {request.message}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAcceptRequest(request)}
                          disabled={processingRequests.has(request.id)}
                          className="flex items-center gap-1"
                        >
                          {processingRequests.has(request.id) ? (
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(request)}
                          disabled={processingRequests.has(request.id)}
                          className="flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
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