import React from 'react';

interface DealbreakersData {
  dealbreakers?: string[];
  customDealbreakers?: string;
  dealbreakersFlexibility?: 'strict' | 'moderate' | 'flexible' | 'very-flexible' | '';
}

interface Props {
  data: DealbreakersData;
  updateData: (data: Partial<DealbreakersData>) => void;
}

const Dealbreakers: React.FC<Props> = ({ data, updateData }) => {
  const commonDealbreakers = [
    "Smoking",
    "Different religious beliefs",
    "Different political views",
    "Long-distance relationships",
    "Different views on children",
    "Financial instability",
    "Lack of ambition",
    "Poor communication",
    "Substance abuse",
    "Dishonesty"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-pink-500">Dealbreakers</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select your absolute dealbreakers
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonDealbreakers.map((dealbreaker) => (
            <label key={dealbreaker} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-2 border-pink-500/30 text-pink-500 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300"
                checked={data.dealbreakers?.includes(dealbreaker) || false}
                onChange={(e) => {
                  const current = data.dealbreakers || [];
                  if (e.target.checked) {
                    updateData({ dealbreakers: [...current, dealbreaker] });
                  } else {
                    updateData({
                      dealbreakers: current.filter((d: string) => d !== dealbreaker)
                    });
                  }
                }}
              />
              <span className="text-sm text-gray-700">{dealbreaker}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Dealbreakers
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 min-h-[120px] bg-white"
          rows={4}
          value={data.customDealbreakers || ''}
          onChange={(e) => updateData({ customDealbreakers: e.target.value })}
          placeholder="List any other dealbreakers that are important to you..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flexibility Level
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/50 focus:border-pink-500/50 focus:outline-none transition-all duration-300 bg-white"
          value={data.dealbreakersFlexibility || ''}
          onChange={(e) => updateData({ dealbreakersFlexibility: e.target.value as DealbreakersData['dealbreakersFlexibility'] })}
        >
          <option value="">Select flexibility level</option>
          <option value="strict">Very Strict - No Exceptions</option>
          <option value="moderate">Moderate - Some Flexibility</option>
          <option value="flexible">Flexible - Depends on the Person</option>
          <option value="very-flexible">Very Flexible - Few Hard Rules</option>
        </select>
      </div>
    </div>
  );
};

export default Dealbreakers;