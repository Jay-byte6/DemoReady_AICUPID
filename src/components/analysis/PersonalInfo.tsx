import React from 'react';
import { motion } from 'framer-motion';

interface PersonalInfoProps {
  data: Record<string, any>;
  updateData: (data: Record<string, any>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Basic Information */}
      <h2 className="text-2xl font-semibold mb-6 text-pink-500">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">First Name</label>
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
            placeholder="Your last name"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
            placeholder="Your email address"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
            placeholder="Your phone number"
          />
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
          <input
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            value={data.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 bg-white"
            placeholder="Your city/location"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">About Me</label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 focus:border-pink-500/40 hover:border-pink-500/40 focus:outline-none transition-all duration-300 min-h-[120px] bg-white"
          placeholder="Tell us about yourself..."
        />
      </div>
    </motion.div>
  );
};

export default PersonalInfo;