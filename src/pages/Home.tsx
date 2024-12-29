import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, SmartMatch } from '../types';
import CompatibilityCheckModal from '../components/CompatibilityCheckModal';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  // Only show compatibility check if user is logged in
  const handleCompatibilityCheck = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowCompatibilityModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI CUPID</h1>
        <p className="text-gray-600">Your intelligent matchmaking companion</p>
      </div>

      {/* Check Compatibility Button */}
      <div className="max-w-xl mx-auto mb-12">
        <button
          onClick={handleCompatibilityCheck}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
        >
          <span className="mr-2">🔍</span>
          Check Compatibility with CUPID ID
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Personality Analysis Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Personality Analysis</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete your comprehensive personality assessment
          </p>
          <button
            onClick={() => navigate('/personality-analysis')}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
          >
            Start Analysis →
          </button>
        </div>

        {/* Smart Matching Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
          <p className="text-gray-600 text-sm mb-4">
            Discover your most compatible matches (75%+ compatibility)
          </p>
          <button
            onClick={() => navigate('/smart-matching')}
            className="text-pink-600 text-sm font-medium hover:text-pink-700"
          >
            View Matches →
          </button>
        </div>

        {/* Relationship Insights Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Relationship Insights</h3>
          <p className="text-gray-600 text-sm mb-4">
            View your favorites and chat history
          </p>
          <button
            onClick={() => navigate('/relationship-insights')}
            className="text-purple-600 text-sm font-medium hover:text-purple-700"
          >
            View Insights →
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Your AI CUPID Stats</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">0</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Active Chats</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-sm text-gray-600">Profile Completion</div>
          </div>
        </div>
      </div>

      {/* Compatibility Check Modal */}
      {user && (
        <CompatibilityCheckModal
          isOpen={showCompatibilityModal}
          onClose={() => setShowCompatibilityModal(false)}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default Home; 