import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Send, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../../services/supabaseService';
import { generateChatResponse } from '../../services/openai';
import { UserProfile } from '../../types';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupidId, setCupidId] = useState<string>('');
  const [isCupidIdEntered, setIsCupidIdEntered] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserPersona = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profile = await profileService.getUserProfileByCupidId(id);
      
      if (!profile) {
        setError('Profile not found. Please check the CUPID ID and try again.');
        return;
      }

      setUserProfile(profile);
      setIsCupidIdEntered(true);
      
      const welcomeMessage = profile.name 
        ? `Great! I've found ${profile.name}'s profile. How can I help you today?`
        : "Great! I've found the profile. How can I help you today?";
        
      setMessages(prev => [...prev, {
        content: welcomeMessage,
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (err) {
      console.error('Error fetching user persona:', err);
      setError('Unable to fetch user profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    const message = input.value.trim();
    
    if (!message) return;
    
    if (!isCupidIdEntered) {
      setCupidId(message);
      await fetchUserPersona(message);
    } else if (userProfile) {
      setMessages(prev => [...prev, { content: message, isUser: true, timestamp: new Date().toISOString() }]);
      input.value = '';
      
      try {
        setIsLoading(true);
        const response = await generateChatResponse(message, userProfile);
        setMessages(prev => [...prev, { content: response, isUser: false, timestamp: new Date().toISOString() }]);
      } catch (err) {
        console.error('Error generating response:', err);
        setMessages(prev => [...prev, { 
          content: "I'm sorry, I couldn't generate a response. Please try again.", 
          isUser: false,
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset chat when opening
      setMessages([]);
      setCupidId('');
      setIsCupidIdEntered(false);
      setUserProfile(null);
      setError(null);
      // Show greeting animation
      setShowGreeting(true);
      setTimeout(() => setShowGreeting(false), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div className="fixed bottom-20 right-24 z-[1000]">
      {/* Floating Cupid icon button */}
      <motion.button
        onClick={toggleChat}
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-colors relative group"
        title="Talk to Cupid"
      >
        <div className="absolute inset-0 bg-pink-400/30 rounded-full animate-ping" />
        <Heart 
          size={28} 
          className="transform rotate-45 group-hover:scale-110 transition-transform"
          fill="white"
        />
      </motion.button>

      {/* Cupid Greeting Animation */}
      <AnimatePresence>
        {isOpen && showGreeting && (
          <motion.div
            initial={{ scale: 0, x: 0 }}
            animate={{ scale: 1, x: -280 }}
            exit={{ scale: 0, x: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute bottom-0 left-0 z-50"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-pink-500 p-3 rounded-full shadow-lg">
                <Heart 
                  size={40} 
                  className="transform rotate-45"
                  fill="white"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white px-4 py-2 rounded-lg shadow-lg border border-pink-500/30"
              >
                <p className="text-lg font-semibold text-pink-500">Hey There...!!</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-pink-500/30"
          >
            <div className="flex justify-between items-center p-4 border-b border-pink-500/30">
              <h3 className="text-lg font-semibold text-pink-500">Talk to Cupid</h3>
              <button 
                onClick={toggleChat}
                className="text-gray-500 hover:text-pink-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-gray-700">
                  {!isCupidIdEntered 
                    ? "Hi! Please enter a CUPID ID to start chatting about that profile." 
                    : `Hi! I'm Cupid, your AI assistant. Ask me anything about ${userProfile?.name || 'the'} profile!`}
                </p>
              </div>
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg">
                  <p>{error}</p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-pink-500/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={!isCupidIdEntered ? "Enter CUPID ID..." : "Type your message..."}
                  className="flex-1 px-4 py-2 rounded-lg border border-pink-500/30 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="submit"
                  className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors"
                  disabled={isLoading}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant; 