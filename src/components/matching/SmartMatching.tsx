import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { matchingService } from '../../services/matchingService';
import { SmartMatch } from '../../types';
import { supabase } from '../../lib/supabase';

export const SmartMatching: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const matchResults = await matchingService.findCompatibleMatches(user.id);
      setMatches(matchResults);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (matchId: string, isFavorite: boolean) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('favorite_profiles')
        .upsert(
          {
            user_id: user.id,
            favorite_user_id: matchId,
            created_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,favorite_user_id'
          }
        );

      if (error) throw error;

      setMatches(prev =>
        prev.map(match =>
          match.profile.id === matchId
            ? { ...match, is_favorite: isFavorite }
            : match
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadMatches}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Smart Matches</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <div
            key={match.profile.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Profile Image */}
            <div className="h-48 bg-gray-200">
              {match.profile.profile_image ? (
                <img
                  src={match.profile.profile_image}
                  alt={match.profile.fullname || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">
                  {match.profile.fullname || 'Anonymous'}
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded">
                  {Math.round(match.compatibility_score)}% Match
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                {match.profile.location || 'Location not specified'}
              </p>

              {/* Quick Insights */}
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium">Age:</span>{' '}
                  {match.profile.age || 'Not specified'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Occupation:</span>{' '}
                  {match.profile.occupation || 'Not specified'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => toggleFavorite(match.profile.id, !match.is_favorite)}
                  className={`px-4 py-2 rounded ${
                    match.is_favorite
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-gray-100 text-gray-700'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {match.is_favorite ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No matches found. Try adjusting your preferences.</p>
        </div>
      )}
    </div>
  );
}; 