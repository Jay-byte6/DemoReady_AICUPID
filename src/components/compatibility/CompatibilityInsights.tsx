import React from 'react';
import { MatchedProfile, CompatibilityDetails } from '../../types';

interface CompatibilityInsightsProps {
  matchedProfile: MatchedProfile;
  onClose?: () => void;
}

export const CompatibilityInsights: React.FC<CompatibilityInsightsProps> = ({
  matchedProfile,
  onClose
}) => {
  const { compatibility } = matchedProfile;
  const details = compatibility.details;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Compatibility Analysis</h2>
        
        {/* Compatibility Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800">Overall</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {Math.round(compatibility.overall)}%
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-pink-800">Emotional</h3>
            <p className="text-2xl font-bold text-pink-600">
              {Math.round(compatibility.emotional)}%
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Intellectual</h3>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(compatibility.intellectual)}%
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Lifestyle</h3>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(compatibility.lifestyle)}%
            </p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Relationship Strengths</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {details.strengths.map((strength: string, index: number) => (
                <li key={index} className="text-green-800">{strength}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Challenges */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Potential Challenges</h3>
          <div className="bg-red-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {details.challenges.map((challenge: string, index: number) => (
                <li key={index} className="text-red-800">{challenge}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Long-term Prediction */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Long-term Prediction</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">{details.long_term_prediction}</p>
          </div>
        </div>

        {/* Improvement Tips */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Tips for Success</h3>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {details.tips.map((tip: string, index: number) => (
                <li key={index} className="text-indigo-800">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};