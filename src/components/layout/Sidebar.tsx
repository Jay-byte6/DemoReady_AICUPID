import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Sparkles, Settings, LogOut, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AICupidLogo from '../../assets/AICupidLogo';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);

  const handleSmartMatchingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoAnimation(true);
    
    // After animation completes, navigate to smart matching
    setTimeout(() => {
      setShowLogoAnimation(false);
      navigate('/smart-matching');
    }, 3000);
  };

  const menuItems = [
    {
      path: '/profile',
      name: 'Your Persona',
      icon: User,
      onClick: undefined,
    },
    {
      path: '/personality-analysis',
      name: 'Personality Analysis',
      icon: Brain,
      onClick: undefined,
    },
    {
      path: '/smart-matching',
      name: 'Smart Matching',
      icon: Heart,
      onClick: handleSmartMatchingClick,
    },
    {
      path: '/relationship-insights',
      name: 'Relationship Insights',
      icon: MessageCircle,
      onClick: undefined,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 h-[calc(100vh-4rem)] bg-gradient-to-b from-purple-900 via-pink-900 to-rose-900 fixed left-0 top-16 z-0 shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-start space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                AI CUPID
              </h1>
              <AICupidLogo className="transform hover:scale-105 transition-transform" size={52} />
            </div>
          </div>

          <div className="flex-1 py-2 flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.onClick}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pink-300' : 'text-pink-300/80'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/10">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg group"
            >
              <Settings className="w-5 h-5 text-pink-300/80 group-hover:text-pink-300" />
              Profile Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg group"
            >
              <LogOut className="w-5 h-5 text-pink-300/80 group-hover:text-pink-300" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Logo Animation Portal */}
      <AnimatePresence>
        {showLogoAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-500/90 to-rose-400/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: -100, y: -100, scale: 0.1 }}
              animate={{ 
                x: 0, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
              className="relative"
            >
              <AICupidLogo size={300} />
              
              {/* Heart Shower */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-pink-200"
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: -50,
                      scale: 0.5 + Math.random() * 1
                    }}
                    animate={{
                      y: window.innerHeight + 50,
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    style={{
                      left: `${Math.random() * 100}%`
                    }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>

              {/* Loading Text */}
              <motion.p
                className="text-white text-2xl mt-8 text-center font-semibold drop-shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                Finding Your Perfect Matches...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 