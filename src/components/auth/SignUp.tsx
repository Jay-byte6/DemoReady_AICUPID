import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { profileService } from '../../services/supabaseService';
import { UserProfile } from '../../types';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      // 2. Initialize user profile
      const defaultProfile: Partial<UserProfile> = {
        user_id: authData.user.id,
        email: authData.user.email || '',
        name: '',
        age: 18,
        location: '',
        bio: '',
        occupation: '',
        profile_image: '',
        interests: [],
        visibility_settings: {
          smart_matching_visible: true,
          profile_image_visible: true,
          occupation_visible: true,
          contact_visible: true,
          master_visibility: true
        }
      };

      await profileService.updateUserProfile(authData.user.id, defaultProfile);

      // 3. Redirect to registration page
      navigate('/registration');
    } catch (error) {
      console.error('Error in signup:', error);
      setError(error instanceof Error ? error.message : 'Database error saving new user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Create your account</h1>
        <p className="text-center mb-8">
          Or{' '}
          <a href="/login" className="text-primary hover:underline">
            sign in to your account
          </a>
        </p>

        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </div>
    </div>
  );
} 