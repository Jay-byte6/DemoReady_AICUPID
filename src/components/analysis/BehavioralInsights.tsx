import React from 'react';

interface BehavioralInsightsData {
  loveLanguage?: 'words' | 'acts' | 'gifts' | 'time' | 'touch' | '';
  socialBattery?: 'high' | 'moderate' | 'low' | 'variable' | '';
  stressResponse?: 'talk' | 'alone' | 'active' | 'distraction' | '';
  decisionMaking?: 'logical' | 'intuitive' | 'collaborative' | 'spontaneous' | '';
}

interface Props {
  data: BehavioralInsightsData;
  updateData: (data: Partial<BehavioralInsightsData>) => void;
}

const BehavioralInsights: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-pink-500">Behavioral Insights</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Love Language
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.loveLanguage || ''}
          onChange={(e) => updateData({ loveLanguage: e.target.value as BehavioralInsightsData['loveLanguage'] })}
        >
          <option value="">Select love language</option>
          <option value="words">Words of Affirmation</option>
          <option value="acts">Acts of Service</option>
          <option value="gifts">Receiving Gifts</option>
          <option value="time">Quality Time</option>
          <option value="touch">Physical Touch</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Social Battery
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.socialBattery || ''}
          onChange={(e) => updateData({ socialBattery: e.target.value as BehavioralInsightsData['socialBattery'] })}
        >
          <option value="">Select social energy level</option>
          <option value="high">High (Very Social)</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low (Need Lots of Alone Time)</option>
          <option value="variable">Variable (Depends on Situation)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stress Response
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.stressResponse || ''}
          onChange={(e) => updateData({ stressResponse: e.target.value as BehavioralInsightsData['stressResponse'] })}
        >
          <option value="">Select stress response</option>
          <option value="talk">Need to Talk It Out</option>
          <option value="alone">Need Space to Process</option>
          <option value="active">Need Physical Activity</option>
          <option value="distraction">Seek Distraction</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Decision Making Style
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.decisionMaking || ''}
          onChange={(e) => updateData({ decisionMaking: e.target.value as BehavioralInsightsData['decisionMaking'] })}
        >
          <option value="">Select decision making style</option>
          <option value="logical">Logical and Analytical</option>
          <option value="intuitive">Intuitive and Gut-Based</option>
          <option value="collaborative">Collaborative and Consensus-Seeking</option>
          <option value="spontaneous">Spontaneous and Flexible</option>
        </select>
      </div>
    </div>
  );
};

export default BehavioralInsights;