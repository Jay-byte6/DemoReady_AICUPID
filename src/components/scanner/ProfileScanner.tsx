import React, { useState } from 'react';
import { Search, Scan, ArrowRight, Loader2 } from 'lucide-react';
import { matchingService } from '../../services/matchingService';
import { CompatibilityInsights } from '../compatibility/CompatibilityInsights';
import ErrorAlert from '../ErrorAlert';
import { SmartMatch } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileScannerProps {
  onProfileScanned?: (profile: SmartMatch) => void;
}

const ProfileScanner: React.FC<ProfileScannerProps> = ({ onProfileScanned }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<SmartMatch | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleScan = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a CUPID ID');
      return;
    }

    if (!user) {
      setError('Please log in to scan profiles');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const match = await matchingService.findMatchByCupidId(user.id, searchQuery);
      setMatchedProfile(match);
      if (onProfileScanned) {
        onProfileScanned(match);
      }
      setShowInsights(true);
    } catch (err) {
      console.error('Error scanning profile:', err);
      setError('Failed to find profile. Please check the CUPID ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Scan className="w-8 h-8 text-indigo-500 mr-2" />
          <h2 className="text-2xl font-bold">Profile Scanner</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-8">
          Enter a CUPID ID to get instant compatibility insights
        </p>
        
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter CUPID ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleScan();
              }
            }}
          />
          <button 
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg disabled:bg-indigo-400"
            onClick={handleScan}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Scan Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>

        {showInsights && matchedProfile && (
          <CompatibilityInsights
            profile={matchedProfile}
            onClose={() => setShowInsights(false)}
          />
        )}
      </div>
    </section>
  );
};

export default ProfileScanner;