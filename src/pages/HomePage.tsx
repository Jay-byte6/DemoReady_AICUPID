import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Users, Brain, ChevronRight, ArrowRight, MessageCircleHeart, Crown, Star, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import CompatibilityCard from '../components/CompatibilityCard';
import CompatibilityInsights from '../components/compatibility/CompatibilityInsights';
import ProfileScanner from '../components/ProfileScanner';
import { useAuth } from '../contexts/AuthContext';
import { SmartMatch } from '../types';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);

  const handleViewInsights = (profile: SmartMatch) => {
    setSelectedProfile(profile);
    setShowCompatibilityModal(false);
  };

  const handleProfileScanned = (profile: SmartMatch) => {
    setSelectedProfile(profile);
    setShowCompatibilityModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white py-20">
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-16 h-16 text-white mr-3" />
              </motion.div>
              <h1 className="text-5xl font-bold">AI Cupid</h1>
            </div>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto mb-12">
              Experience the future of dating with our advanced AI-powered compatibility analysis
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/smart-matching')}
              className="bg-white text-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-50 transition-colors inline-flex items-center gap-2"
            >
              Find Your Match <ArrowRight className="w-5 h-5" />
            </motion.button>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold">10k+</div>
                <div className="text-white/80">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-white/80">Match Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-white/80">AI Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-lg py-4 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/personality-analysis')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors"
              >
                <Brain className="w-4 h-4" />
                Take Personality Test
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/personality-analysis')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
              Popular
            </div>
            <Brain className="w-12 h-12 text-indigo-500 mb-6 transform group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4">Personality Analysis</h3>
            <p className="text-gray-600 mb-6">Advanced AI assessment of personality traits and compatibility factors</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>High Accuracy</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/smart-matching')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
            <div className="absolute top-2 right-2 bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-semibold">
              New
            </div>
            <Sparkles className="w-12 h-12 text-rose-500 mb-6 transform group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4">Smart Matching</h3>
            <p className="text-gray-600 mb-6">Find your most compatible matches with our AI algorithm</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>95% Success</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
            <div className="absolute top-2 right-2 bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
              Premium
            </div>
            <MessageCircleHeart className="w-12 h-12 text-purple-500 mb-6 transform group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4">Relationship Insights</h3>
            <p className="text-gray-600 mb-6">Detailed compatibility insights and relationship guidance</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Scanner Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-6">Profile Scanner</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Our advanced AI analyzes profiles in real-time to find your perfect match. 
              Upload a profile or enter details to get instant compatibility insights.
            </p>
            <ProfileScanner onScanComplete={handleProfileScanned} />
          </div>
        </div>
      </div>

      {/* Compatibility Insights Modal */}
      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/smart-matching')}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Heart className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Home;