import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const createProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          // Profile already exists, redirect to profile page
          navigate('/profile');
          return;
        }

        // Create new profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: user.id,
            email: user.email,
          }]);

        if (profileError) {
          throw profileError;
        }

        // Redirect to personality analysis to complete profile
        navigate('/personality-analysis');
      } catch (err: any) {
        console.error('Error in onboarding:', err);
        setError(err.message || 'Failed to create profile');
      } finally {
        setLoading(false);
      }
    };

    createProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Setting up your profile...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Onboarding; 