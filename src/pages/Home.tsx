import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CompatibilityCheckModal from '../components/CompatibilityCheckModal';
import type { UserProfile, CompatibilityScore } from '../types';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{
    profile: UserProfile;
    compatibility: CompatibilityScore;
  } | null>(null);

  const handleViewInsights = (profile: UserProfile, compatibility: CompatibilityScore) => {
    setSelectedProfile({ profile, compatibility });
    setShowCompatibilityModal(false);
    navigate('/relationship-insights', { 
      state: { profile, compatibility } 
    });
  };

  const sections = [
    {
      title: 'Personality Analysis',
      description: 'Complete your comprehensive personality assessment',
      icon: User,
      link: '/personality-analysis',
      color: 'bg-indigo-500'
    },
    {
      title: 'Smart Matching',
      description: 'Discover your most compatible matches (75%+ compatibility)',
      icon: Heart,
      link: '/smart-matching',
      color: 'bg-pink-500'
    },
    {
      title: 'Relationship Insights',
      description: 'View your favorites and chat history',
      icon: MessageCircle,
      link: '/relationship-insights',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI CUPID
        </h1>
        <p className="text-xl text-gray-600">
          Your intelligent matchmaking companion
        </p>
      </div>

      {/* CUPID ID Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <button
          onClick={() => setShowCompatibilityModal(true)}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Check Compatibility with CUPID ID
        </button>
      </div>

      {/* Main Sections */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
              <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-gray-600">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Your AI CUPID Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">0</div>
            <div className="text-gray-600">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">Active Chats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-gray-600">Profile Completion</div>
          </div>
        </div>
      </div>

      {/* Compatibility Check Modal */}
      <CompatibilityCheckModal
        isOpen={showCompatibilityModal}
        onClose={() => setShowCompatibilityModal(false)}
        onViewInsights={handleViewInsights}
      />
    </div>
  );
};

export default Home; 