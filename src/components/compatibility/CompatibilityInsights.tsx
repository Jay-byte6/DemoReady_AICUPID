import React, { useState } from 'react';
import { X, Heart, MessageCircle, Gift, Clock, Star, Sparkles, Brain, Sun, ArrowRight, ThumbsUp, AlertTriangle } from 'lucide-react';
import { MatchedProfile } from '../../types/profile';
import CompatibilityScore from './CompatibilityScore';

interface Props {
  profile: MatchedProfile;
  onClose: () => void;
}

const CompatibilityInsights: React.FC<Props> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { personalInfo, compatibility } = profile;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'strengths', label: 'Strengths', icon: ThumbsUp },
    { id: 'challenges', label: 'Challenges', icon: AlertTriangle },
    { id: 'tips', label: 'Tips & Guidance', icon: Gift }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-rose-500 mr-2" fill="currentColor" />
              <h2 className="text-2xl font-bold">Compatibility Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={profile.image}
                alt={personalInfo.fullName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {personalInfo.fullName}, {personalInfo.age}
              </h3>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
                <span className="text-lg font-semibold">
                  {Math.round(compatibility.overall * 100)}% Compatible
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-indigo-500 mr-2" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{personalInfo.occupation}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-green-500 mr-2" />
                  <span>CUPID ID: {profile.cupidId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-1 py-4 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Compatibility Scores */}
                <section>
                  <h4 className="text-lg font-semibold mb-4">Compatibility Breakdown</h4>
                  <CompatibilityScore
                    emotional={compatibility.emotional}
                    intellectual={compatibility.intellectual}
                    lifestyle={compatibility.lifestyle}
                  />
                </section>

                {/* Long-term Prediction */}
                <section className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">Long-term Prediction</h4>
                  <p className="text-indigo-700">{compatibility.details.long_term_prediction}</p>
                </section>
              </>
            )}

            {activeTab === 'strengths' && (
              <section>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
                  Relationship Strengths
                </h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {compatibility.details.strengths.map((strength, index) => (
                      <li key={`strength-${index}`} className="text-green-700 flex items-start">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {activeTab === 'challenges' && (
              <section>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Potential Challenges
                </h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {compatibility.details.challenges.map((challenge, index) => (
                      <li key={`challenge-${index}`} className="text-yellow-700 flex items-start">
                        <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {activeTab === 'tips' && (
              <section>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Gift className="w-5 h-5 text-indigo-500 mr-2" />
                  Tips & Guidance
                </h4>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {compatibility.details.tips.map((tip, index) => (
                      <li key={`tip-${index}`} className="text-indigo-700 flex items-start">
                        <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat
            </button>
            <button className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
              <Heart className="w-5 h-5 mr-2" />
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityInsights;