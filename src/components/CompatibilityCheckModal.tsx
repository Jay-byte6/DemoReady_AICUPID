import React, { useState } from 'react';
import { UserProfile, CompatibilityScore } from '../types';
import { supabase } from '../lib/supabase';

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  targetUser: UserProfile;
}

const CompatibilityCheckModal: React.FC<CompatibilityCheckModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCompatibility = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('compatibility_analysis')
        .select('*')
        .eq('user1_id', currentUser.user_id)
        .eq('user2_id', targetUser.user_id)
        .single();

      if (fetchError) throw fetchError;

      if (existingAnalysis) {
        setCompatibilityScore(existingAnalysis.score);
      } else {
        // Calculate new compatibility score
        const score: CompatibilityScore = {
          overall: calculateOverallScore(),
          emotional: calculateEmotionalScore(),
          intellectual: calculateIntellectualScore(),
          lifestyle: calculateLifestyleScore(),
          score: 0, // Will be calculated based on other scores
          insights: generateInsights(),
          details: {
            strengths: generateStrengths(),
            challenges: generateChallenges(),
            tips: generateTips(),
            long_term_prediction: generatePrediction()
          }
        };

        score.score = (score.overall + score.emotional + score.intellectual + score.lifestyle) / 4;

        // Save to database
        const { error: saveError } = await supabase
          .from('compatibility_analysis')
          .insert({
            user1_id: currentUser.user_id,
            user2_id: targetUser.user_id,
            score
          });

        if (saveError) throw saveError;
        setCompatibilityScore(score);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    // Implement overall compatibility calculation
    return Math.random() * 100; // Placeholder
  };

  const calculateEmotionalScore = () => {
    // Implement emotional compatibility calculation
    return Math.random() * 100; // Placeholder
  };

  const calculateIntellectualScore = () => {
    // Implement intellectual compatibility calculation
    return Math.random() * 100; // Placeholder
  };

  const calculateLifestyleScore = () => {
    // Implement lifestyle compatibility calculation
    return Math.random() * 100; // Placeholder
  };

  const generateInsights = () => {
    // Generate compatibility insights
    return [
      'You both share similar values',
      'Your communication styles complement each other',
      'You have compatible life goals'
    ];
  };

  const generateStrengths = () => {
    // Generate relationship strengths
    return [
      'Strong emotional connection',
      'Similar interests',
      'Complementary personalities'
    ];
  };

  const generateChallenges = () => {
    // Generate potential challenges
    return [
      'Different communication styles',
      'Varying life priorities',
      'Different approaches to conflict'
    ];
  };

  const generateTips = () => {
    // Generate improvement tips
    return [
      'Practice active listening',
      'Schedule regular quality time',
      'Be open about your feelings'
    ];
  };

  const generatePrediction = () => {
    // Generate long-term prediction
    return 'This relationship shows strong potential for long-term compatibility with proper communication and understanding.';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Compatibility Analysis</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">Analyzing compatibility...</p>
          </div>
        ) : compatibilityScore ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">Overall Compatibility</h3>
                <p className="text-2xl font-bold text-indigo-600">{compatibilityScore.overall.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">Emotional Compatibility</h3>
                <p className="text-2xl font-bold text-indigo-600">{compatibilityScore.emotional.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">Intellectual Compatibility</h3>
                <p className="text-2xl font-bold text-indigo-600">{compatibilityScore.intellectual.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">Lifestyle Compatibility</h3>
                <p className="text-2xl font-bold text-indigo-600">{compatibilityScore.lifestyle.toFixed(1)}%</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Insights</h3>
              <ul className="list-disc pl-5 space-y-1">
                {compatibilityScore.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {compatibilityScore.details.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Challenges</h3>
              <ul className="list-disc pl-5 space-y-1">
                {compatibilityScore.details.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Improvement Tips</h3>
              <ul className="list-disc pl-5 space-y-1">
                {compatibilityScore.details.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Long-term Prediction</h3>
              <p>{compatibilityScore.details.long_term_prediction}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={analyzeCompatibility}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Analyze Compatibility
          </button>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityCheckModal;