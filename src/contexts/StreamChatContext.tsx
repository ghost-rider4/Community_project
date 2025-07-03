import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';

interface StreamChatContextType {
  chatClient: StreamChat | null;
  isReady: boolean;
}

const apiKey = 'kt3cr78evu5y';
const StreamChatContext = createContext<StreamChatContextType | null>(null);

export const useStreamChat = () => useContext(StreamChatContext);

export const StreamChatProvider: React.FC<{ userId: string; userName?: string; children: React.ReactNode }> = ({ userId, userName, children }) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const client = StreamChat.getInstance(apiKey);
    fetch('http://localhost:5001/stream/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then(res => res.json())
      .then(async ({ token }) => {
        await client.connectUser({ id: userId, name: userName }, token);
        setChatClient(client);
        setIsReady(true);
      });
    return () => { client.disconnectUser(); };
  }, [userId, userName]);

  return (
    <StreamChatContext.Provider value={{ chatClient, isReady }}>
      {chatClient ? <Chat client={chatClient} theme="messaging dark">{children}</Chat> : null}
    </StreamChatContext.Provider>
  );
}; 