import React, { useState } from 'react';
import { X, Heart, User, ArrowRight, Loader2 } from 'lucide-react';
import { profileService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile, CompatibilityScore } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onViewInsights: (profile: UserProfile, compatibility: CompatibilityScore) => void;
}

const CompatibilityCheckModal: React.FC<Props> = ({ isOpen, onClose, onViewInsights }) => {
  const { user } = useAuth();
  const [cupidId, setCupidId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    profile: UserProfile;
    compatibility: CompatibilityScore;
  } | null>(null);

  const handleCheck = async () => {
    if (!cupidId.trim() || !user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { targetProfile, compatibility } = await profileService.analyzeCompatibilityByCupidId(
        user.id,
        cupidId
      );

      setResult({
        profile: targetProfile,
        compatibility
      });
    } catch (err: any) {
      console.error('Error checking compatibility:', err);
      setError(err.message || 'Failed to check compatibility');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Check Compatibility</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input */}
          {!result && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter CUPID ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cupidId}
                  onChange={(e) => setCupidId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter 6-digit CUPID ID"
                  maxLength={6}
                />
                <button
                  onClick={handleCheck}
                  disabled={loading || !cupidId.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {result.profile.fullname}
                  </h3>
                  <p className="text-gray-500">{result.profile.location}</p>
                  <div className="mt-2 flex items-center">
                    <Heart className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="text-lg font-semibold text-pink-600">
                      {Math.round(result.compatibility.score * 100)}% Compatible
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Quick Insights</h4>
                <ul className="space-y-2">
                  {result.compatibility.insights.slice(0, 3).map((insight, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => onViewInsights(result.profile, result.compatibility)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  View Full Insights
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCheckModal; 