import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import type { SmartMatch, UserProfile } from '../../types';
import { Heart, MessageCircle, Eye, Star, AlertCircle } from 'lucide-react';

interface SmartMatchingProps {
  onViewCompatibility: (match: SmartMatch) => void;
}

const SmartMatching: React.FC<SmartMatchingProps> = ({ onViewCompatibility }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLowMatches, setShowLowMatches] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load favorites first
      const userFavorites = await profileService.getFavoriteProfiles(user.id);
      setFavorites(userFavorites.map(f => f.favorite_user_id));

      // Load matches
      const matchResults = await profileService.findTopMatches(user.id, 20);
      
      // Transform results into SmartMatch format
      const smartMatches: SmartMatch[] = matchResults.map(result => ({
        profile: result.user,
        compatibility_score: result.compatibility.compatibility_score,
        compatibility_details: {
          strengths: result.compatibility.strengths || [],
          challenges: result.compatibility.challenges || [],
          tips: result.compatibility.improvement_tips || [],
          long_term_prediction: result.compatibility.long_term_prediction || ''
        },
        is_favorite: userFavorites.some(f => f.favorite_user_id === result.user.user_id)
      }));

      setMatches(smartMatches);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (matchId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(matchId)) {
        await profileService.removeFavoriteProfile(user.id, matchId);
        setFavorites(prev => prev.filter(id => id !== matchId));
      } else {
        if (favorites.length >= 5) {
          alert('You can only have up to 5 favorite profiles. Please remove one before adding another.');
          return;
        }
        await profileService.addFavoriteProfile(user.id, matchId);
        setFavorites(prev => [...prev, matchId]);
      }

      // Update matches to reflect favorite status
      setMatches(prev => prev.map(match => 
        match.profile.user_id === matchId 
          ? { ...match, is_favorite: !match.is_favorite }
          : match
      ));
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite status');
    }
  };

  const handleRequestPersonaView = async (matchId: string) => {
    if (!user) return;

    try {
      await profileService.createMatchRequest(user.id, matchId, 'PERSONA_VIEW');
      // Update match status
      setMatches(prev => prev.map(match => 
        match.profile.user_id === matchId 
          ? { 
              ...match, 
              request_status: { 
                ...match.request_status,
                persona_view: 'PENDING'
              }
            }
          : match
      ));
    } catch (err: any) {
      console.error('Error requesting persona view:', err);
      alert('Failed to send persona view request');
    }
  };

  const handleRequestChat = async (matchId: string) => {
    if (!user) return;

    try {
      await profileService.createMatchRequest(user.id, matchId, 'CHAT');
      // Update match status
      setMatches(prev => prev.map(match => 
        match.profile.user_id === matchId 
          ? { 
              ...match, 
              request_status: { 
                ...match.request_status,
                chat: 'PENDING'
              }
            }
          : match
      ));
    } catch (err: any) {
      console.error('Error requesting chat:', err);
      alert('Failed to send chat request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (matches.length === 0 && !showLowMatches) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No High Compatibility Matches Found</h3>
        <p className="text-gray-600 mb-4">
          Would you like to see profiles with lower compatibility scores?
        </p>
        <button
          onClick={() => setShowLowMatches(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Show All Profiles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <div key={match.profile.user_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Image */}
            <div className="relative h-48 bg-gray-200">
              {match.profile.profile_image ? (
                <img
                  src={match.profile.profile_image}
                  alt={match.profile.fullname || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleFavorite(match.profile.user_id)}
                  className={`p-2 rounded-full ${
                    match.is_favorite ? 'bg-pink-500 text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {match.profile.fullname || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    CUPID ID: {match.profile.cupid_id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(match.compatibility_score)}%
                  </div>
                  <div className="text-xs text-gray-500">Compatibility</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4 space-x-2">
                <button
                  onClick={() => onViewCompatibility(match)}
                  className="flex-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200"
                >
                  View Match
                </button>
                <button
                  onClick={() => handleRequestPersonaView(match.profile.user_id)}
                  disabled={match.request_status?.persona_view === 'PENDING'}
                  className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleRequestChat(match.profile.user_id)}
                  disabled={match.request_status?.chat === 'PENDING'}
                  className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartMatching; 