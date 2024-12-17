import React from 'react';
import { Heart, ArrowRight, ThumbsUp } from 'lucide-react';
import { MatchedProfile } from '../../types/profile';
import CompatibilityScore from './CompatibilityScore';

interface Props {
  profile: MatchedProfile;
  onViewInsights: () => void;
  isLiked?: boolean;
  onLike?: (liked: boolean) => void;
}

const CompatibilityCard: React.FC<Props> = ({ profile, onViewInsights, isLiked, onLike }) => {
  const { personalInfo, preferences, compatibility } = profile;
  const traits = preferences.interests || [];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={profile.image}
          alt={personalInfo.fullName}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-rose-500 mr-1" fill="currentColor" />
            <span className="font-semibold">{Math.round(compatibility.overall * 100)}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          {personalInfo.fullName}, {personalInfo.age}
        </h3>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
              <span
                key={`${trait}-${index}`}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <CompatibilityScore
          emotional={compatibility.emotional}
          intellectual={compatibility.intellectual}
          lifestyle={compatibility.lifestyle}
        />
        
        <div className="flex items-center justify-between mt-4">
          {onLike && (
            <button
              onClick={() => onLike(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <ThumbsUp className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
          <button
            onClick={onViewInsights}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            View Insights
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCard;