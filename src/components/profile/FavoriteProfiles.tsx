import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import { FavoriteProfile, CompatibilityInsight } from '../../types';

interface FavoriteProfileCardProps {
  favorite: FavoriteProfile;
  onRemove: (favoriteUserId: string) => Promise<void>;
  onRefresh: (favoriteUserId: string) => Promise<void>;
}

const FavoriteProfileCard: React.FC<FavoriteProfileCardProps> = ({
  favorite,
  onRemove,
  onRefresh
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this profile from favorites?')) {
      await onRemove(favorite.favorite_user_id);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await onRefresh(favorite.favorite_user_id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={favorite.profile?.profile_image || '/default-avatar.png'}
                alt={favorite.profile?.fullname}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                {favorite.compatibility_insights?.compatibility_score}%
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{favorite.profile?.fullname}</h3>
              <p className="text-sm text-gray-600">
                {favorite.profile?.age} • {favorite.profile?.location}
              </p>
              <p className="text-xs text-gray-500">Cupid ID: {favorite.profile?.cupid_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 text-gray-500 hover:text-rose-600 rounded-full hover:bg-rose-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {expanded && favorite.compatibility_insights && (
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Summary</h4>
              <p className="text-gray-600 mt-1">{favorite.compatibility_insights.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Long-term Prediction</h4>
              <p className="text-gray-600 mt-1">{favorite.compatibility_insights.long_term_prediction}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Strengths</h4>
                <ul className="mt-2 space-y-1">
                  {favorite.compatibility_insights.strengths.map((strength, index) => (
                    <li key={index} className="text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Challenges</h4>
                <ul className="mt-2 space-y-1">
                  {favorite.compatibility_insights.challenges.map((challenge, index) => (
                    <li key={index} className="text-orange-600 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FavoriteProfiles: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const data = await profileService.getFavoriteProfiles(user!.id);
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteUserId: string) => {
    try {
      await profileService.removeFromFavorites(user!.id, favoriteUserId);
      setFavorites(prev => prev.filter(f => f.favorite_user_id !== favoriteUserId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleRefresh = async (favoriteUserId: string) => {
    try {
      const insights = await profileService.generateCompatibilityInsights(user!.id, favoriteUserId);
      setFavorites(prev => prev.map(f => 
        f.favorite_user_id === favoriteUserId 
          ? { ...f, compatibility_insights: insights }
          : f
      ));
    } catch (error) {
      console.error('Error refreshing insights:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center p-8">
        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Favorite Profiles</h3>
        <p className="text-gray-600 mt-1">
          Add profiles to your favorites to see detailed compatibility insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map(favorite => (
        <FavoriteProfileCard
          key={favorite.id}
          favorite={favorite}
          onRemove={handleRemove}
          onRefresh={handleRefresh}
        />
      ))}
    </div>
  );
};

export default FavoriteProfiles; 