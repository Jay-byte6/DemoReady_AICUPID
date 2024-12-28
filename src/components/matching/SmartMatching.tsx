import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { matchingService } from '../../services/matchingService';
import { SmartMatch, UserProfile, CompatibilityScore } from '../../types';
import { supabase } from '../../lib/supabase';
import { Button, Dialog } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import DetailedCompatibilityView from '../compatibility/DetailedCompatibilityView';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export const SmartMatching: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompatibility, setShowCompatibility] = useState(false);
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

      const success = await profileService.toggleFavorite(user.id, matchId, isFavorite);
      
      if (success) {
        setMatches(prev =>
          prev.map(match =>
            match.profile.user_id === matchId
              ? { ...match, is_favorite: isFavorite }
              : match
          )
        );

        toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    }
  };

  const handleViewProfile = (match: SmartMatch) => {
    try {
      setSelectedProfile(match);
      setShowCompatibility(true);
    } catch (err) {
      console.error('Error showing compatibility insights:', err);
      toast.error('Failed to show compatibility insights');
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
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Profile Image */}
            <div className="relative h-48">
              {match.profile.profile_image ? (
                <img
                  src={match.profile.profile_image || ''}
                  alt={match.profile.fullname || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                  <span className="text-4xl font-bold text-white">
                    {(match.profile.fullname || 'Anonymous').charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => toggleFavorite(match.profile.id, !match.is_favorite)}
                  className={`p-2 rounded-full ${
                    match.is_favorite
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600'
                  } hover:scale-110 transition-transform duration-200`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={match.is_favorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {match.profile.fullname || 'Anonymous'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    CUPID ID: {match.profile.cupid_id}
                  </p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full font-medium">
                  {Math.round(match.compatibility_score)}% Match
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {match.profile.location && (
                  <p className="text-gray-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {match.profile.location}
                  </p>
                )}
                {match.profile.age && (
                  <p className="text-gray-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {match.profile.age} years old
                  </p>
                )}
                {match.profile.occupation && (
                  <p className="text-gray-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {match.profile.occupation}
                  </p>
                )}
              </div>

              {/* Interests */}
              {match.profile.interests && match.profile.interests.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility Preview */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Compatibility Highlights</h3>
                <div className="space-y-2">
                  {match.compatibility_details.strengths.slice(0, 2).map((strength, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {strength}
                    </p>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              {match.last_updated && (
                <p className="text-xs text-gray-500 mb-4">
                  Last updated: {formatDistanceToNow(new Date(match.last_updated))}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewProfile(match)}
                  startIcon={<Visibility />}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  View Insights
                </Button>
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

      {/* Compatibility Dialog */}
      {selectedProfile && (
        <Dialog
          open={showCompatibility}
          onClose={() => setShowCompatibility(false)}
          maxWidth="lg"
          fullWidth
        >
          <DetailedCompatibilityView
            isOpen={showCompatibility}
            onClose={() => setShowCompatibility(false)}
            onBack={() => setShowCompatibility(false)}
            profile={selectedProfile.profile}
            compatibility_details={{
              overall: selectedProfile.compatibility_score,
              emotional: Math.round(selectedProfile.compatibility_score * 0.9),
              intellectual: Math.round(selectedProfile.compatibility_score * 0.95),
              lifestyle: Math.round(selectedProfile.compatibility_score * 0.85),
              summary: selectedProfile.compatibility_details.long_term_prediction,
              strengths: selectedProfile.compatibility_details.strengths,
              challenges: selectedProfile.compatibility_details.challenges,
              tips: selectedProfile.compatibility_details.tips,
              long_term_prediction: selectedProfile.compatibility_details.long_term_prediction
            }}
          />
        </Dialog>
      )}
    </div>
  );
}; 