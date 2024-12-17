import React from 'react';
import { ArrowLeft, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import CompatibilityCard from './CompatibilityCard';
import CompatibilityInsights from './CompatibilityInsights';

interface Profile {
  id: number;
  name: string;
  age: number;
  compatibility: number;
  image: string;
  traits: string[];
  loveLanguage: string;
  liked?: boolean;
}

interface Props {
  profiles: Profile[];
  onBack: () => void;
}

const CompatibleProfiles: React.FC<Props> = ({ profiles, onBack }) => {
  const [selectedProfile, setSelectedProfile] = React.useState<Profile | null>(null);
  const [likedProfiles, setLikedProfiles] = React.useState<Set<number>>(new Set());

  const handleLike = (profileId: number, liked: boolean) => {
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
          Back to Analysis
        </button>
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-rose-500 mr-2" />
          <h1 className="text-2xl font-bold">Your Top 10 Matches</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.slice(0, 10).map((profile) => (
          <CompatibilityCard
            key={profile.id}
            profile={profile}
            onViewInsights={() => setSelectedProfile(profile)}
            isLiked={likedProfiles.has(profile.id)}
            onLike={(liked) => handleLike(profile.id, liked)}
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