import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { matchingService } from '../services/matchingService';
import { profileService } from '../services/supabaseService';
import { Heart, MessageCircle } from 'lucide-react';
import type { SmartMatch } from '../types';

const SmartMatching = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const matchData = await matchingService.findTopMatches(user!.id);
      setMatches(matchData);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.message || 'Error loading matches');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (matchId: string) => {
    if (!user) return;
    
    try {
      const isFavorited = await profileService.toggleFavoriteProfile(user.id, matchId);
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.profile.user_id === matchId 
            ? { ...match, is_favorite: isFavorited }
            : match
        )
      );
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      // Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Matching</h1>
        <p className="text-gray-600">
          Discover your most compatible matches powered by AI
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No matches found yet. Complete your profile to start matching!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.profile.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                {match.profile.profile_image && (
                  <img
                    src={match.profile.profile_image}
                    alt={match.profile.fullname || 'Profile'}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleFavorite(match.profile.user_id)}
                    className={`p-2 rounded-full ${
                      match.is_favorite
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-gray-600'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {match.profile.fullname || 'Anonymous'}
                  </h3>
                  <span className="text-sm font-medium text-indigo-600">
                    {Math.round(match.compatibility_score)}% Match
                  </span>
                </div>

                <div className="space-y-2">
                  {match.compatibility_details.strengths.slice(0, 2).map((strength, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      ✓ {strength}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => {/* Handle view profile */}}
                    className="flex-1 mr-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {/* Handle start chat */}}
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartMatching; 