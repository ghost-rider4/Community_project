import React, { useState } from 'react';
import { X, MessageCircle, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Mentor } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { sendChatRequest } from '../../services/mentorshipService';

interface ChatRequestModalProps {
  open: boolean;
  onClose: () => void;
  mentor: Mentor;
}

export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  open,
  onClose,
  mentor
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await sendChatRequest(
        user.id,
        user.name,
        mentor.id,
        mentor.name,
        message.trim(),
        user.photoURL
      );
      
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send chat request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <Card className="w-full max-w-lg bg-white dark:bg-gray-900 relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send Chat Request
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mentor Info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Avatar name={mentor.name} size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {mentor.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {mentor.experience}
              </p>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="default" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Introduction Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like to connect with this mentor..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};