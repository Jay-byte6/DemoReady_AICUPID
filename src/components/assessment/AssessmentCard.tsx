import React from 'react';
import { motion } from 'framer-motion';

interface AssessmentCardProps {
  icon: React.ReactNode;
  title: string;
  scores: Array<{
    label: string;
    value: number;
  }>;
  insights: string[];
  buttonText: string;
  onButtonClick: () => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  icon,
  title,
  scores,
  insights,
  buttonText,
  onButtonClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-pink-500">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4 mb-6">
        {scores.map((score, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{score.label}</span>
              <span className="text-sm font-semibold text-pink-500">{score.value}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-[#EC4899]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6 flex-grow">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Insights:</h4>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span className="text-sm text-gray-600">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onButtonClick}
        className="w-full px-4 py-2 bg-[#EC4899] text-white rounded-lg font-medium 
                 hover:bg-[#DB2777] transform hover:scale-[1.02] transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 shadow-md"
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export default AssessmentCard; 