import React from 'react';
import { motion } from 'framer-motion';

interface PreferencesProps {
  data: Record<string, any>;
  updateData: (data: Record<string, any>) => void;
}

const Preferences: React.FC<PreferencesProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  const handleInterestChange = (interest: string) => {
    const currentInterests = data.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i: string) => i !== interest)
      : [...currentInterests, interest];
    handleChange('interests', newInterests);
  };

  const interests = [
    'Reading', 'Travel', 'Music',
    'Sports', 'Art', 'Cooking',
    'Photography', 'Gaming', 'Nature',
    'Technology', 'Dancing', 'Movies'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-pink-500">Preferences</h2>

      {/* Age Range Preference */}
      <div>
        <label className="block text-gray-700 font-semibold mb-4">Age Range Preference</label>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 text-sm mb-2">Min Age</label>
            <input
              type="number"
              value={data.minAge || ''}
              onChange={(e) => handleChange('minAge', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
              placeholder="Minimum age"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-2">Max Age</label>
            <input
              type="number"
              value={data.maxAge || ''}
              onChange={(e) => handleChange('maxAge', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
              placeholder="Maximum age"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-gray-700 font-semibold mb-4">Interests</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {interests.map((interest) => (
            <label
              key={interest}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={data.interests?.includes(interest) || false}
                onChange={() => handleInterestChange(interest)}
                className="form-checkbox h-5 w-5 text-pink-500 rounded border-2 border-pink-500/30 focus:border-pink-500/40 focus:ring-pink-500"
              />
              <span className="text-gray-700 group-hover:text-pink-500 transition-colors">
                {interest}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance Preference */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Preferred Distance</label>
        <select
          value={data.preferredDistance || ''}
          onChange={(e) => handleChange('preferredDistance', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
        >
          <option value="">Select preferred distance</option>
          <option value="5">Within 5 miles</option>
          <option value="10">Within 10 miles</option>
          <option value="25">Within 25 miles</option>
          <option value="50">Within 50 miles</option>
          <option value="100">Within 100 miles</option>
          <option value="anywhere">Anywhere</option>
        </select>
      </div>

      {/* Education Level */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Education Level Preference</label>
        <select
          value={data.educationLevel || ''}
          onChange={(e) => handleChange('educationLevel', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
        >
          <option value="">Select education level</option>
          <option value="high_school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="any">Any Education Level</option>
        </select>
      </div>

      {/* Additional Preferences */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
        <textarea
          value={data.additionalPreferences || ''}
          onChange={(e) => handleChange('additionalPreferences', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 min-h-[120px] bg-white"
          placeholder="Any other preferences you'd like to share..."
        />
      </div>
    </motion.div>
  );
};

export default Preferences;