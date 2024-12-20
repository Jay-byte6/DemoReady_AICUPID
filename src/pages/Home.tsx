import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, CompatibilityScore } from '../types';
import CompatibilityCheckModal from '../components/CompatibilityCheckModal';

interface HomeProps {
  // Add any props if needed
}

const Home: React.FC<HomeProps> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore | null>(null);

  const handleViewInsights = (profile: UserProfile, compatibility: CompatibilityScore) => {
    setSelectedProfile(profile);
    setCompatibilityScore(compatibility);
    setIsModalOpen(true);
  };

  const handleNavigateToInsights = () => {
    if (selectedProfile && compatibilityScore) {
      navigate('/relationship-insights', {
        state: { profile: selectedProfile, compatibility: compatibilityScore }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
          Check Compatibility
        </button>
      </div>

      {/* Compatibility Check Modal */}
      <CompatibilityCheckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile || undefined}
        compatibility={compatibilityScore || undefined}
        onViewInsights={handleNavigateToInsights}
      />
    </div>
  );
};

export default Home; 