import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import CompatibilityCard from './CompatibilityCard';
import CompatibilityInsights from './CompatibilityInsights';
import { MatchedProfile } from '../../types/profile';

interface Props {
  profiles: MatchedProfile[];
  onBack: () => void;
}

const CompatibleProfiles: React.FC<Props> = ({ profiles, onBack }) => {
  const [selectedProfile, setSelectedProfile] = useState<MatchedProfile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  const handleLike = (profileId: string, liked: boolean) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      if (liked) {
        newSet.add(profileId);
      } else {
        newSet.delete(profileId);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Search
        </button>
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-rose-500 mr-2" />
          <h1 className="text-2xl font-bold">Your Top Matches</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <CompatibilityCard
            key={profile.cupidId}
            profile={profile}
            onViewInsights={() => setSelectedProfile(profile)}
            isLiked={likedProfiles.has(profile.cupidId)}
            onLike={(liked) => handleLike(profile.cupidId, liked)}
          />
        ))}
      </div>

      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

export default CompatibleProfiles;