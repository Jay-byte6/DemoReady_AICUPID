import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { CompatibilityScore, UserProfile } from '../types';
import { profileService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CompatibilityOverview from './compatibility/CompatibilityOverview';
import CompatibilityDetails from './compatibility/CompatibilityDetails';

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompatibilityCheckModal: React.FC<CompatibilityCheckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupidId, setCupidId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [result, setResult] = useState<{
    profile: UserProfile;
    compatibility: CompatibilityScore;
  } | null>(null);

  const handleCheck = async () => {
    if (!user) {
      setError('Please log in to check compatibility');
      return;
    }

    if (!cupidId) {
      setError('Please enter a CUPID ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get profile by CUPID ID directly from supabase
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('cupid_id', cupidId)
        .single();

      if (profileError || !profile) {
        setError('Profile not found');
        return;
      }

      // Get compatibility score
      let compatibility;
      try {
        compatibility = await profileService.getCompatibilityScore(user.id, profile.user_id);
      } catch (err) {
        console.error('Error getting compatibility score:', err);
        // If there's an error getting the score, create a default one
        compatibility = {
          compatibility_score: 75, // Default score
          strengths: ['Similar interests', 'Compatible life goals'],
          challenges: ['Need more information'],
          improvement_tips: ['Complete your profiles for better insights'],
          long_term_prediction: 'Complete your profiles for detailed predictions'
        };
      }
      
      // Calculate sub-scores based on overall compatibility
      const overallScore = compatibility?.compatibility_score || 75; // Default to 75 if null
      
      // Ensure compatibility has the correct structure
      const formattedCompatibility: CompatibilityScore = {
        overall: overallScore,
        emotional: compatibility?.emotional || Math.round(overallScore * 0.8),
        intellectual: compatibility?.intellectual || Math.round(overallScore * 0.9),
        lifestyle: compatibility?.lifestyle || Math.round(overallScore * 0.85),
        summary: compatibility?.summary || compatibility?.long_term_prediction || 'Based on your profiles, you have potential for a meaningful connection.',
        strengths: compatibility?.strengths || ['Similar interests'],
        challenges: compatibility?.challenges || ['Need more information'],
        tips: compatibility?.improvement_tips || ['Complete your profiles for better insights'],
        long_term_prediction: compatibility?.long_term_prediction || 'Complete your profiles for detailed predictions'
      };
      
      setResult({
        profile,
        compatibility: formattedCompatibility
      });
    } catch (err: any) {
      console.error('Error checking compatibility:', err);
      setError(err.message || 'Failed to check compatibility');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCupidId('');
    setResult(null);
    setError(null);
    setShowDetails(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            {!result ? 'Check Compatibility' : 'Compatibility Analysis'}
          </Dialog.Title>

          {!result ? (
            <>
              <p className="text-gray-600 mb-6">
                Enter the CUPID ID of the person you want to check compatibility with
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={cupidId}
                  onChange={(e) => setCupidId(e.target.value)}
                  placeholder="Enter CUPID ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded-lg text-white transition-colors
                    ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {loading ? 'Checking...' : 'Check Compatibility'}
                </button>
              </div>
            </>
          ) : showDetails ? (
            <CompatibilityDetails
              profile={result.profile}
              compatibility={result.compatibility}
              onBack={() => setShowDetails(false)}
            />
          ) : (
            <CompatibilityOverview
              profile={result.profile}
              compatibility={result.compatibility}
              onViewDetails={() => setShowDetails(true)}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CompatibilityCheckModal;