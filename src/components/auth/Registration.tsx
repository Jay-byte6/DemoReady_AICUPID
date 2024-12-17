import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import ErrorAlert from '../ErrorAlert';

const Registration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    gender: '',
    location: '',
    occupation: '',
    relationship_history: '',
    lifestyle: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullname) return 'Full name is required';
    if (!formData.age) return 'Age is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.location) return 'Location is required';
    if (!formData.occupation) return 'Occupation is required';
    if (!formData.relationship_history) return 'Relationship history is required';
    if (!formData.lifestyle) return 'Lifestyle information is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to complete registration');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create user profile (CUPID ID will be generated automatically)
      const profile = await profileService.updateUserProfile(user.id, {
        ...formData,
        email: user.email
      });

      if (!profile) {
        throw new Error('Failed to create profile');
      }

      // Navigate to personality analysis
      navigate('/personality-analysis');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to complete registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Complete Your Profile</h1>
        <p className="text-gray-600">Tell us about yourself to get your unique CUPID ID</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="18"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Your occupation"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship History
          </label>
          <select
            name="relationship_history"
            value={formData.relationship_history}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select status</option>
            <option value="never-married">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lifestyle
          </label>
          <textarea
            name="lifestyle"
            value={formData.lifestyle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Describe your lifestyle, daily routines, and interests..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Creating Profile...' : 'Continue to Personality Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration; 