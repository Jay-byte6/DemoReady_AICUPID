import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { CompatibilityScore, UserProfile } from '../types';

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInsights?: (profile: UserProfile, compatibility: CompatibilityScore) => void;
  profile?: UserProfile;
  compatibility?: CompatibilityScore;
}

const CompatibilityCheckModal: React.FC<CompatibilityCheckModalProps> = ({
  isOpen,
  onClose,
  onViewInsights,
  profile,
  compatibility: initialCompatibility
}) => {
  const [loading, setLoading] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore>({
    overall: 0,
    emotional: 0,
    intellectual: 0,
    lifestyle: 0,
    summary: '',
    strengths: [],
    challenges: [],
    tips: [],
    long_term_prediction: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialCompatibility) {
        setCompatibilityScore(initialCompatibility);
        setLoading(false);
      } else {
        setLoading(true);
        // Simulate API call
        const timer = setTimeout(() => {
          const score: CompatibilityScore = {
            overall: Math.random() * 100,
            emotional: Math.random() * 100,
            intellectual: Math.random() * 100,
            lifestyle: Math.random() * 100,
            summary: 'This is a compatibility summary.',
            strengths: ['Similar values', 'Complementary personalities'],
            challenges: ['Different communication styles'],
            tips: ['Practice active listening', 'Schedule regular date nights'],
            long_term_prediction: 'Strong potential for long-term compatibility'
          };
          setCompatibilityScore(score);
          setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialCompatibility]);

  const handleViewInsights = () => {
    if (onViewInsights && profile) {
      onViewInsights(profile, compatibilityScore);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
          <Dialog.Title className="text-2xl font-bold mb-6">
            Compatibility Analysis
          </Dialog.Title>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold">Overall Compatibility</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {compatibilityScore.overall.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold">Emotional Compatibility</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {compatibilityScore.emotional.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold">Intellectual Compatibility</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {compatibilityScore.intellectual.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold">Lifestyle Compatibility</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {compatibilityScore.lifestyle.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-gray-600">{compatibilityScore.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Strengths</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {compatibilityScore.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Challenges</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {compatibilityScore.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                {onViewInsights && profile && (
                  <button
                    onClick={handleViewInsights}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    View Full Insights
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CompatibilityCheckModal;