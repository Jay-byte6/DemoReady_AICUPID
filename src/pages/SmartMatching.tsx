import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import { SmartMatch } from '../types/profile';
import toast from 'react-hot-toast';
import DetailedCompatibilityView from '../components/compatibility/DetailedCompatibilityView';
import MatchGrid from '../components/matching/MatchGrid';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const SmartMatching = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SmartMatch | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

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
      console.log('Loaded matches:', matchResults);
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
      const success = await profileService.toggleFavorite(user.id, matchId, isFavorite);
      if (success) {
        toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
        setMatches(prevMatches => 
          prevMatches.map(match => 
            match.profile.user_id === matchId 
              ? { ...match, is_favorite: isFavorite }
              : match
          )
        );
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error(err.message || 'Failed to update favorites');
    }
  };

  const handleViewProfile = (match: SmartMatch) => {
    setSelectedProfile(match);
    setShowDetailedView(true);
  };

  const handleRefreshCompatibility = async (userId: string) => {
    if (!user) return;
    try {
      setRefreshing(userId);
      const compatibilityScore = await profileService.getCompatibilityAnalysis(user.id, userId);
      if (compatibilityScore) {
        setMatches(prevMatches =>
          prevMatches.map(match =>
            match.profile.user_id === userId
              ? {
                  ...match,
                  compatibility_score: compatibilityScore.overall,
                  compatibility_details: {
                    strengths: compatibilityScore.strengths,
                    challenges: compatibilityScore.challenges,
                    tips: compatibilityScore.tips,
                    long_term_prediction: compatibilityScore.long_term_prediction
                  },
                  last_updated: new Date().toISOString()
                }
              : match
          )
        );
        toast.success('Compatibility insights updated');
      }
    } catch (err) {
      console.error('Error refreshing compatibility:', err);
      toast.error('Failed to refresh compatibility insights');
    } finally {
      setRefreshing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500/30 border-t-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 ml-[240px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-pink-500">Smart Matches</h1>
          </div>
          <p className="text-gray-600 mb-8">Discover your most compatible connections</p>

          <div className="grid grid-cols-3 gap-6 max-w-3xl">
            <div className="bg-white rounded-xl p-4 shadow-md border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-500">{matches.length}</div>
              <div className="text-gray-600">Potential Matches</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-500">
                {matches.filter(m => m.compatibility_score >= 80).length}
              </div>
              <div className="text-gray-600">High Compatibility</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-500">
                {matches.filter(m => m.is_favorite).length}
              </div>
              <div className="text-gray-600">Favorites</div>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <MatchGrid
          matches={matches}
          onToggleFavorite={handleToggleFavorite}
          onRefreshCompatibility={handleRefreshCompatibility}
          onViewProfile={handleViewProfile}
          refreshing={refreshing}
        />

        {selectedProfile && showDetailedView && (
          <DetailedCompatibilityView
            isOpen={showDetailedView}
            onClose={() => setShowDetailedView(false)}
            onBack={() => setShowDetailedView(false)}
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
        )}
      </div>
    </div>
  );
};

export default SmartMatching; 