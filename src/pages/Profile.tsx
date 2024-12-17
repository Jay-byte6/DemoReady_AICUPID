import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Heart, Brain, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import PersonaInsights from '../components/profile/PersonaInsights';
import ProfileImageUpload from '../components/profile/ProfileImageUpload';
import type { AIPersona, NegativePersona, UserProfile } from '../types';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [positivePersona, setPositivePersona] = useState<AIPersona | null>(null);
  const [negativePersona, setNegativePersona] = useState<NegativePersona | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Loading profile data for user:', user.id);

        // Load user profile
        const profile = await profileService.getUserProfile(user.id);
        console.log('Loaded profile:', profile);
        
        if (!profile) {
          console.log('No profile found');
          setError('Profile not found. Please complete your personality analysis first.');
          setLoading(false);
          return;
        }
        setUserProfile(profile);

        // Load personas
        console.log('Loading personas...');
        try {
          const [positive, negative] = await Promise.all([
            profileService.getPositivePersona(user.id),
            profileService.getNegativePersona(user.id)
          ]);
          console.log('Loaded positive persona:', JSON.stringify(positive, null, 2));
          console.log('Loaded negative persona:', JSON.stringify(negative, null, 2));

          if (!positive || !negative) {
            console.log('Missing persona data');
            setError('Personality analysis incomplete. Please complete your analysis first.');
            setLoading(false);
            return;
          }

          // Ensure the personas have the required structure
          const hasValidStructure = validatePersonaData(positive, negative);
          console.log('Persona validation result:', hasValidStructure);

          if (!hasValidStructure) {
            console.error('Invalid persona data structure');
            setError('There was an issue loading your personality analysis. Please try again.');
            setLoading(false);
            return;
          }

          setPositivePersona(positive);
          setNegativePersona(negative);
        } catch (personaError: any) {
          console.error('Error loading personas:', personaError);
          setError('Failed to load personality analysis. Please try again.');
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.error('Error loading profile data:', err);
        setError(err.message || 'Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Helper function to validate persona data structure
  const validatePersonaData = (positive: any, negative: any): boolean => {
    try {
      console.log('Validating positive persona:', JSON.stringify(positive, null, 2));
      console.log('Validating negative persona:', JSON.stringify(negative, null, 2));

      // Check if both personas exist
      if (!positive || !negative) {
        console.error('Missing persona data');
        return false;
      }

      // Helper function to ensure array structure
      const ensureArrayStructure = (obj: any, mainKey: string, subKey: string) => {
        if (!obj[mainKey]) {
          obj[mainKey] = { [subKey]: [] };
        } else if (Array.isArray(obj[mainKey])) {
          // If the main key is directly an array, transform it
          obj[mainKey] = { [subKey]: obj[mainKey] };
        } else if (!obj[mainKey][subKey]) {
          obj[mainKey][subKey] = [];
        } else if (!Array.isArray(obj[mainKey][subKey])) {
          obj[mainKey][subKey] = [];
        }
      };

      // Transform positive persona structure if needed
      ensureArrayStructure(positive, 'personality_traits', 'examples');
      ensureArrayStructure(positive, 'core_values', 'examples');
      ensureArrayStructure(positive, 'behavioral_traits', 'examples');
      ensureArrayStructure(positive, 'hobbies_interests', 'examples');

      // Transform negative persona structure if needed
      ensureArrayStructure(negative, 'emotional_weaknesses', 'traits');
      ensureArrayStructure(negative, 'social_weaknesses', 'traits');
      ensureArrayStructure(negative, 'lifestyle_weaknesses', 'traits');
      ensureArrayStructure(negative, 'relational_weaknesses', 'traits');

      // Ensure summaries exist
      if (typeof positive.summary !== 'string') positive.summary = '';
      if (typeof negative.summary !== 'string') negative.summary = '';

      // Log transformed data
      console.log('Transformed positive persona:', JSON.stringify(positive, null, 2));
      console.log('Transformed negative persona:', JSON.stringify(negative, null, 2));

      return true;
    } catch (error) {
      console.error('Error validating persona data:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Please complete your personality analysis first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start space-x-6">
          <ProfileImageUpload
            userId={user?.id || ''}
            currentImage={userProfile?.profile_image || null}
            onImageUpdate={(newImageUrl) => {
              setUserProfile(prev => prev ? { ...prev, profile_image: newImageUrl } : null);
            }}
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userProfile.fullname || 'Anonymous User'}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userProfile.location || 'Location not set'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">CUPID ID</div>
                <div className="font-mono text-lg font-semibold text-indigo-600">
                  {userProfile.cupid_id || 'Not Generated'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email || 'Email not set'}
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {userProfile.occupation || 'Occupation not set'}
                </div>
              </div>
              <div>
                <div className="flex items-center text-gray-600">
                  <Heart className="w-4 h-4 mr-2" />
                  {userProfile.relationship_history || 'Relationship history not set'}
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Brain className="w-4 h-4 mr-2" />
                  {userProfile.lifestyle || 'Lifestyle not set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Insights */}
      {positivePersona && negativePersona && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personality Analysis</h2>
          <PersonaInsights
            positivePersona={positivePersona}
            negativePersona={negativePersona}
          />
        </div>
      )}
    </div>
  );
};

export default Profile; 