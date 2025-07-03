import React from 'react';
import { useStreamChat } from '../../contexts/StreamChatContext';
import { Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { Card } from '../ui/Card';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  channelType: 'messaging' | 'team';
  members: string[];
  channelId?: string; // Optional: use existing channel
}

export const ChatModal: React.FC<ChatModalProps> = ({ open, onClose, channelType, members, channelId }) => {
  const streamChat = useStreamChat();
  const chatClient = streamChat?.chatClient;
  const [channel, setChannel] = React.useState<any>(null);

  React.useEffect(() => {
    if (!open || !chatClient) {
      setChannel(null);
      return;
    }
    let channel;
    if (channelId) {
      channel = chatClient.channel(channelType, channelId);
    } else {
      // For one-on-one or group, create or get channel with these members
      channel = chatClient.channel(channelType, {
        members,
      });
    }
    setChannel(channel);
    channel.watch();
    return () => channel && channel.stopWatching();
    // eslint-disable-next-line
  }, [open, chatClient, channelType, channelId, JSON.stringify(members)]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 chat-modal-dark" onClick={handleBackdropClick}>
      <style>{`
        .chat-modal-dark .str-chat, .chat-modal-dark .str-chat__main-panel, .chat-modal-dark .str-chat__channel, .chat-modal-dark .str-chat__thread,
        .chat-modal-dark .str-chat__message-list, .chat-modal-dark .str-chat__input-flat, .chat-modal-dark .str-chat__input-flat-wrapper {
          background-color: #18181b !important;
          color: #fff !important;
        }
        .chat-modal-dark .str-chat__message-simple-content, .chat-modal-dark .str-chat__message-simple-text {
          color: #fff !important;
        }
        .chat-modal-dark .str-chat__input-flat textarea, .chat-modal-dark .str-chat__input-flat-input {
          background-color: #27272a !important;
          color: #fff !important;
        }
        .chat-modal-dark .str-chat__avatar {
          background: #27272a !important;
        }
      `}</style>
      <Card className="w-full max-w-3xl h-[85vh] flex flex-col bg-white dark:bg-gray-900 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          &times;
        </button>
        {channel && (
          <Channel channel={channel} key={channel.id}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        )}
      </Card>
    </div>
  );
}; 