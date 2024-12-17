import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import { profileService } from '../../services/supabaseService';
import { Channel as StreamChannel } from 'stream-chat';
import {
  Chat as StreamChat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  ChannelHeader,
  ChannelList
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

interface ChatProps {
  partnerId?: string;
}

const Chat: React.FC<ChatProps> = ({ partnerId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Get Stream Chat token
        const token = await profileService.getStreamChatToken(user.id);
        
        // Initialize chat client
        await chatService.initializeUser(user.id, token);

        // If partnerId is provided, create or get existing channel
        if (partnerId) {
          const channel = await chatService.createChannel(user.id, partnerId);
          setActiveChannel(channel);
        }

      } catch (err: any) {
        console.error('Error initializing chat:', err);
        setError(err.message || 'Failed to initialize chat');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      // Cleanup on unmount
      chatService.disconnectUser();
    };
  }, [user, partnerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      <StreamChat client={chatService.chatClient} theme="messaging light">
        <Channel channel={activeChannel}>
          <Window>
            <div className="flex h-full">
              {!partnerId && (
                <div className="w-80 border-r border-gray-100">
                  <ChannelList
                    filters={{
                      type: 'messaging',
                      members: { $in: [user?.id] }
                    }}
                    sort={{ last_message_at: -1 }}
                    Preview={(props) => (
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {props.channel?.data?.image ? (
                              <img
                                src={props.channel.data.image}
                                alt="Channel"
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {props.channel?.data?.name?.[0] || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {props.channel?.data?.name || 'Unnamed Channel'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {props.lastMessage?.text || 'No messages yet'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </div>
              <Thread />
            </div>
          </Window>
        </Channel>
      </StreamChat>
    </div>
  );
};

export default Chat; 