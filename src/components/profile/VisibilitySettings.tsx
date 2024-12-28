import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../../types';
import profileService from '../../services/supabaseService';

interface VisibilitySettingsProps {
  userProfile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ userProfile, onUpdate }) => {
  const [settings, setSettings] = useState(userProfile.visibility_settings || {
    smart_matching_visible: true,
    profile_image_visible: true,
    occupation_visible: true,
    contact_visible: true,
    master_visibility: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update settings when master visibility changes
  useEffect(() => {
    if (!settings.master_visibility) {
      setSettings(prev => ({
        ...prev,
        smart_matching_visible: false,
        profile_image_visible: false,
        occupation_visible: false,
        contact_visible: false,
      }));
    }
  }, [settings.master_visibility]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await profileService.updateUserProfile(userProfile.user_id, {
        ...userProfile,
        visibility_settings: settings,
      });
      onUpdate(updatedProfile);
    } catch (error) {
      console.error('Error saving visibility settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Visibility Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Master Visibility Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium">Master Visibility</div>
              <div className="text-sm text-gray-500">Control overall profile visibility in smart matching</div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('master_visibility')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.master_visibility ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.master_visibility ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Individual Settings */}
        <div className="space-y-4 pl-4 border-l-2 border-gray-100">
          {/* Smart Matching Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.smart_matching_visible ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div className="font-medium">Smart Matching Visibility</div>
            </div>
            <button
              onClick={() => handleToggle('smart_matching_visible')}
              disabled={!settings.master_visibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.smart_matching_visible && settings.master_visibility ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.smart_matching_visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Profile Picture Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.profile_image_visible ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div className="font-medium">Profile Picture Visibility</div>
            </div>
            <button
              onClick={() => handleToggle('profile_image_visible')}
              disabled={!settings.master_visibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.profile_image_visible && settings.master_visibility ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.profile_image_visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Occupation Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.occupation_visible ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div className="font-medium">Occupation Visibility</div>
            </div>
            <button
              onClick={() => handleToggle('occupation_visible')}
              disabled={!settings.master_visibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.occupation_visible && settings.master_visibility ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.occupation_visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Contact Information Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.contact_visible ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div className="font-medium">Contact Information Visibility</div>
            </div>
            <button
              onClick={() => handleToggle('contact_visible')}
              disabled={!settings.master_visibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.contact_visible && settings.master_visibility ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.contact_visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings; 