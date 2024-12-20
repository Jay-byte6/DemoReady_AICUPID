import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, RefreshCw, MapPin, Calendar, Clock, Star, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { SmartMatch } from '../types';
import { profileService } from '../services/supabaseService';
import CompatibilityDetails from '../components/matching/CompatibilityDetails';
import { useAuth } from '../contexts/AuthContext';

const SmartMatching = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [bulkRefreshing, setBulkRefreshing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const matchResults = await profileService.findTopMatches(user!.id);
      setMatches(matchResults);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (matchId: string, isFavorite: boolean) => {
    if (!user) return;
    try {
      if (isFavorite) {
        await profileService.addToFavorites(user.id, matchId);
        toast.success('Added to favorites');
      } else {
        await profileService.removeFromFavorites(user.id, matchId);
        toast.success('Removed from favorites');
      }

      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.profile.user_id === matchId 
            ? { ...match, is_favorite: isFavorite }
            : match
        )
      );
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      if (err.message.includes('already in favorites')) {
        setMatches(prevMatches => 
          prevMatches.map(match => 
            match.profile.user_id === matchId 
              ? { ...match, is_favorite: true }
              : match
          )
        );
      } else {
        toast.error(err.message || 'Failed to update favorites');
      }
    }
  };

  const handleViewProfile = (match: SmartMatch) => {
    try {
      setSelectedProfile(match);
    } catch (err) {
      console.error('Error showing compatibility insights:', err);
      toast.error('Failed to show compatibility insights');
    }
  };

  const handleRefreshCompatibility = async (userId: string) => {
    if (!user) return;
    try {
      setRefreshing(userId);
      const updatedInsights = await profileService.generateCompatibilityInsights(user.id, userId);
      
      setMatches(prevMatches =>
        prevMatches.map(match =>
          match.profile.user_id === userId
            ? {
                ...match,
                compatibility_score: updatedInsights.compatibility_score,
                compatibility_details: {
                  strengths: updatedInsights.strengths,
                  challenges: updatedInsights.challenges,
                  tips: updatedInsights.tips,
                  long_term_prediction: updatedInsights.long_term_prediction
                },
                last_updated: new Date().toISOString()
              }
            : match
        )
      );
      toast.success('Compatibility insights updated');
    } catch (err) {
      console.error('Error refreshing compatibility:', err);
      toast.error('Failed to refresh compatibility insights');
    } finally {
      setRefreshing(null);
    }
  };

  const handleBulkRefresh = async () => {
    try {
      setBulkRefreshing(true);
      await Promise.all(
        matches.map(match => handleRefreshCompatibility(match.profile.user_id))
      );
      toast.success('All matches updated successfully');
    } catch (err) {
      console.error('Error updating all matches:', err);
      toast.error('Failed to update all matches');
    } finally {
      setBulkRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
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
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Smart Matching
        </h1>
        <p className="text-gray-600 text-lg">
          Discover your most compatible matches powered by AI
        </p>
        {matches.length > 0 && (
          <button
            onClick={handleBulkRefresh}
            disabled={bulkRefreshing}
            className={`mt-4 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto
              ${bulkRefreshing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'} 
              text-white shadow-md hover:shadow-lg`}
          >
            <RefreshCw className={`w-4 h-4 ${bulkRefreshing ? 'animate-spin' : ''}`} />
            {bulkRefreshing ? 'Updating all matches...' : 'Update all matches'}
          </button>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">No matches found yet. Complete your profile to start matching!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div 
              key={match.profile.id} 
              className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="relative">
                {match.profile.profile_image ? (
                  <img
                    src={match.profile.profile_image}
                    alt={match.profile.fullname || 'Profile'}
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <span className="text-5xl font-bold text-white">
                      {(match.profile.fullname || 'Anonymous').charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleFavorite(match.profile.user_id, !match.is_favorite)}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      match.is_favorite
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-rose-100 hover:text-rose-500'
                    } shadow-lg`}
                    title={match.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${match.is_favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">
                      {match.profile.fullname || 'Anonymous'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRefreshCompatibility(match.profile.user_id)}
                        disabled={refreshing === match.profile.user_id}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 
                          ${refreshing === match.profile.user_id 
                            ? 'bg-gray-400/90 cursor-not-allowed' 
                            : 'bg-white/90 backdrop-blur-sm text-indigo-600 hover:bg-indigo-100'} 
                          shadow-lg`}
                        title="Refresh compatibility analysis"
                      >
                        <RefreshCw 
                          className={`w-4 h-4 ${refreshing === match.profile.user_id ? 'animate-spin' : ''}`} 
                        />
                      </button>
                      <span className="px-4 py-2 bg-indigo-600/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                        {Math.round(match.compatibility_score)}% Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {match.profile.location && (
                    <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-sm">{match.profile.location}</span>
                    </div>
                  )}
                  {match.profile.age && (
                    <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="text-sm">{match.profile.age} years</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Compatibility Insights</h4>
                    {match.last_updated && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated {formatDistanceToNow(new Date(match.last_updated), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {match.compatibility_details.strengths.slice(0, 2).map((strength, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => handleViewProfile(match)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Insights
                  </button>
                  <button
                    onClick={() => {/* Handle start chat */}}
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    title="Start Chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <CompatibilityDetails
          match={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

export default SmartMatching; 