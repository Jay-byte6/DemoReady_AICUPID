import React from 'react';

interface RelationshipGoalsData {
  relationshipType?: 'long-term' | 'marriage' | 'casual' | 'friendship' | '';
  timeline?: 'immediate' | 'few-weeks' | 'few-months' | 'no-rush' | '';
  familyPlans?: 'want-children' | 'dont-want-children' | 'open' | 'have-children' | '';
  relationshipValues?: string;
}

interface Props {
  data: RelationshipGoalsData;
  updateData: (data: Partial<RelationshipGoalsData>) => void;
}

const RelationshipGoals: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-pink-500">Relationship Goals</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are you looking for?
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.relationshipType || ''}
          onChange={(e) => updateData({ relationshipType: e.target.value as RelationshipGoalsData['relationshipType'] })}
        >
          <option value="">Select relationship type</option>
          <option value="long-term">Long-term Relationship</option>
          <option value="marriage">Marriage</option>
          <option value="casual">Casual Dating</option>
          <option value="friendship">Friendship First</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeline
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.timeline || ''}
          onChange={(e) => updateData({ timeline: e.target.value as RelationshipGoalsData['timeline'] })}
        >
          <option value="">Select timeline</option>
          <option value="immediate">Ready to date immediately</option>
          <option value="few-weeks">Within a few weeks</option>
          <option value="few-months">Within a few months</option>
          <option value="no-rush">No specific timeline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Family Plans
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.familyPlans || ''}
          onChange={(e) => updateData({ familyPlans: e.target.value as RelationshipGoalsData['familyPlans'] })}
        >
          <option value="">Select family plans</option>
          <option value="want-children">Want children</option>
          <option value="dont-want-children">Don't want children</option>
          <option value="open">Open to either</option>
          <option value="have-children">Already have children</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship Values
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 min-h-[120px] bg-white"
          rows={4}
          value={data.relationshipValues || ''}
          onChange={(e) => updateData({ relationshipValues: e.target.value })}
          placeholder="Describe your core values and what matters most to you in a relationship..."
        />
      </div>
    </div>
  );
};

export default RelationshipGoals;