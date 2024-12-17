import React from 'react';
import { SmartMatch } from '../../types';
import { CompatibilityInsights } from './CompatibilityInsights';

interface CompatibleProfilesProps {
  profiles: SmartMatch[];
  onProfileSelect: (profile: SmartMatch) => void;
}

export const CompatibleProfiles: React.FC<CompatibleProfilesProps> = ({
  profiles,
  onProfileSelect,
}) => {
  const [selectedProfile, setSelectedProfile] = React.useState<SmartMatch | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((matchedProfile) => (
        <div
          key={matchedProfile.profile.cupidId}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {matchedProfile.profile.personalInfo.fullName}
                </h3>
                <p className="text-gray-600">
                  {matchedProfile.profile.personalInfo.age} • {matchedProfile.profile.personalInfo.location}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-2">
                <span className="text-indigo-600 font-semibold">
                  {Math.round(matchedProfile.compatibility_score)}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Top Strengths</h4>
                <ul className="space-y-1">
                  {matchedProfile.compatibility_details.strengths.slice(0, 2).map((strength, index) => (
                    <li key={index} className="text-green-600 text-sm flex items-center">
                      <span className="mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedProfile(matchedProfile)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                View Compatibility
              </button>
            </div>
          </div>
        </div>
      ))}

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