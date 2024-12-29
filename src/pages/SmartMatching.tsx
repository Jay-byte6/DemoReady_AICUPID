import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import { SmartMatch, CompatibilityScore } from '../types';
import { toast } from 'react-hot-toast';
import MatchGrid from '../components/matching/MatchGrid';
import DetailedCompatibilityView from '../components/compatibility/DetailedCompatibilityView';

const SmartMatching: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<SmartMatch | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const matchData = await profileService.findTopMatches(user.id);
      setMatches(matchData);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (matchId: string, isFavorite: boolean) => {
    if (!user) {
      toast.error('Please sign in to favorite profiles');
      return;
    }
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
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleViewCompatibility = async (userId: string) => {
    if (!user) return;
    try {
      setLoadingInsights(true);
      const compatibilityScore = await profileService.getCompatibilityAnalysis(user.id, userId);
      if (compatibilityScore) {
        const match = matches.find(m => m.profile.user_id === userId);
        if (match) {
          setSelectedMatch(match);
          setShowDetailedView(true);
        }
      }
    } catch (error) {
      console.error('Error fetching compatibility insights:', error);
      toast.error('Failed to load compatibility insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading matches...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Smart Matches</h1>
      <MatchGrid
        matches={matches}
        onToggleFavorite={handleToggleFavorite}
        onRefreshCompatibility={handleViewCompatibility}
        onViewProfile={(match) => {
          setSelectedMatch(match);
          setShowDetailedView(true);
        }}
        refreshing={loadingInsights && selectedMatch ? selectedMatch.profile.user_id : null}
      />
      {showDetailedView && selectedMatch && (
        <DetailedCompatibilityView
          isOpen={showDetailedView}
          onClose={() => setShowDetailedView(false)}
          onBack={() => setShowDetailedView(false)}
          profile={selectedMatch.profile}
          compatibility_details={{
            overall: selectedMatch.compatibility_score,
            emotional: Math.round(selectedMatch.compatibility_score * 0.9),
            intellectual: Math.round(selectedMatch.compatibility_score * 0.95),
            lifestyle: Math.round(selectedMatch.compatibility_score * 0.85),
            summary: selectedMatch.compatibility_details.long_term_prediction,
            strengths: selectedMatch.compatibility_details.strengths,
            challenges: selectedMatch.compatibility_details.challenges,
            tips: selectedMatch.compatibility_details.tips,
            long_term_prediction: selectedMatch.compatibility_details.long_term_prediction
          }}
        />
      )}
    </div>
  );
};

export default SmartMatching; 