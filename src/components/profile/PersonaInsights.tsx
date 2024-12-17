import React from 'react';
import { AIPersona, NegativePersona } from '../../types';

interface PersonaInsightsProps {
  positivePersona: AIPersona;
  negativePersona: NegativePersona;
}

const PersonaInsights: React.FC<PersonaInsightsProps> = ({ positivePersona, negativePersona }) => {
  // Helper function to safely get array data
  const getSafeArray = (data: any, path: string[]): string[] => {
    try {
      let current = data;
      for (const key of path) {
        if (!current?.[key]) return [];
        current = current[key];
      }
      return Array.isArray(current) ? current : [];
    } catch (error) {
      console.error('Error accessing array data:', error);
      return [];
    }
  };

  // Helper function to safely get string data
  const getSafeString = (data: any, key: string): string => {
    return typeof data?.[key] === 'string' ? data[key] : '';
  };

  // Get arrays safely
  const personalityTraits = getSafeArray(positivePersona, ['personality_traits', 'examples']);
  const coreValues = getSafeArray(positivePersona, ['core_values', 'examples']);
  const behavioralTraits = getSafeArray(positivePersona, ['behavioral_traits', 'examples']);
  const hobbiesInterests = getSafeArray(positivePersona, ['hobbies_interests', 'examples']);

  const emotionalWeaknesses = getSafeArray(negativePersona, ['emotional_weaknesses', 'traits']);
  const socialWeaknesses = getSafeArray(negativePersona, ['social_weaknesses', 'traits']);
  const lifestyleWeaknesses = getSafeArray(negativePersona, ['lifestyle_weaknesses', 'traits']);
  const relationalWeaknesses = getSafeArray(negativePersona, ['relational_weaknesses', 'traits']);

  // Get summaries safely
  const positiveSummary = getSafeString(positivePersona, 'summary');
  const negativeSummary = getSafeString(negativePersona, 'summary');

  console.log('Rendering PersonaInsights with data:', {
    positivePersona,
    negativePersona,
    personalityTraits,
    coreValues,
    behavioralTraits,
    hobbiesInterests,
    emotionalWeaknesses,
    socialWeaknesses,
    lifestyleWeaknesses,
    relationalWeaknesses
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Positive Persona */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-green-600 mb-4">Positive Traits & Characteristics</h3>
        
        {/* Personality Traits */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Personality Traits</h4>
          <ul className="list-disc list-inside text-gray-600">
            {personalityTraits.map((trait, index) => (
              <li key={index} className="mb-1">{trait}</li>
            ))}
          </ul>
        </div>

        {/* Core Values */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Core Values</h4>
          <ul className="list-disc list-inside text-gray-600">
            {coreValues.map((value, index) => (
              <li key={index} className="mb-1">{value}</li>
            ))}
          </ul>
        </div>

        {/* Behavioral Traits */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Behavioral Traits</h4>
          <ul className="list-disc list-inside text-gray-600">
            {behavioralTraits.map((trait, index) => (
              <li key={index} className="mb-1">{trait}</li>
            ))}
          </ul>
        </div>

        {/* Hobbies & Interests */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Hobbies & Interests</h4>
          <ul className="list-disc list-inside text-gray-600">
            {hobbiesInterests.map((hobby, index) => (
              <li key={index} className="mb-1">{hobby}</li>
            ))}
          </ul>
        </div>

        {/* Positive Summary */}
        {positiveSummary && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700">{positiveSummary}</p>
          </div>
        )}
      </div>

      {/* Negative Persona */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Growth Areas & Challenges</h3>

        {/* Emotional Weaknesses */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Emotional Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {emotionalWeaknesses.map((weakness, index) => (
              <li key={index} className="mb-1">{weakness}</li>
            ))}
          </ul>
        </div>

        {/* Social Weaknesses */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Social Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {socialWeaknesses.map((weakness, index) => (
              <li key={index} className="mb-1">{weakness}</li>
            ))}
          </ul>
        </div>

        {/* Lifestyle Weaknesses */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Lifestyle Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {lifestyleWeaknesses.map((weakness, index) => (
              <li key={index} className="mb-1">{weakness}</li>
            ))}
          </ul>
        </div>

        {/* Relational Weaknesses */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Relational Aspects</h4>
          <ul className="list-disc list-inside text-gray-600">
            {relationalWeaknesses.map((weakness, index) => (
              <li key={index} className="mb-1">{weakness}</li>
            ))}
          </ul>
        </div>

        {/* Negative Summary */}
        {negativeSummary && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700">{negativeSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaInsights; 