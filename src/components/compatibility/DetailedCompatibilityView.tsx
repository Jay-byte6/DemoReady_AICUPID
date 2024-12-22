import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  ArrowLeft, 
  Star, 
  AlertTriangle, 
  Target,
  Sparkles,
  X
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SmartMatchProfile, CompatibilityScore } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  profile: SmartMatchProfile;
  compatibility_details: CompatibilityScore;
}

const getPersonalityAvatar = () => {
  return <User className="w-12 h-12 text-indigo-500" />;
};

const DetailedCompatibilityView: React.FC<Props> = ({
  isOpen,
  onClose,
  onBack,
  profile,
  compatibility_details
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4F46E5';
    if (score >= 60) return '#059669';
    if (score >= 40) return '#D97706';
    return '#DC2626';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative bg-white rounded-xl max-w-6xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Summary
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Header */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 mb-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  {getPersonalityAvatar()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{profile.fullname}</h2>
              <p className="text-gray-600 mt-1">CUPID ID: {profile.cupid_id}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-gray-600">{profile.age} years</span>
                <span className="text-sm text-gray-600">{profile.location}</span>
                <span className="text-sm text-gray-600">{profile.occupation}</span>
              </div>
            </div>
          </motion.div>

          {/* Overall Compatibility Score */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center text-indigo-600">
                <Heart className="w-6 h-6 mr-2" />
                Overall Compatibility
              </h3>
              <div className="w-40 mx-auto">
                <CircularProgressbar
                  value={compatibility_details.overall}
                  text={`${compatibility_details.overall}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: getScoreColor(compatibility_details.overall),
                    textColor: getScoreColor(compatibility_details.overall),
                    trailColor: '#E5E7EB',
                    pathTransitionDuration: 1
                  })}
                />
              </div>
              <p className="text-gray-600 mt-4 max-w-lg mx-auto">
                {compatibility_details.summary}
              </p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Compatibility Metrics */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                  <Star className="w-6 h-6 mr-2" />
                  Compatibility Metrics
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Emotional', value: compatibility_details.emotional },
                    { label: 'Intellectual', value: compatibility_details.intellectual },
                    { label: 'Lifestyle', value: compatibility_details.lifestyle }
                  ].map((metric: { label: string; value: number }, index: number) => (
                    <div key={metric.label} className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">{metric.label}</h4>
                        <span className="text-sm font-medium text-indigo-600">
                          {metric.value}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="mb-4"
                      >
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Strengths */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600">
                  <Star className="w-6 h-6 mr-2" />
                  Relationship Strengths
                </h3>
                <ul className="space-y-4">
                  {compatibility_details.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <Star className="w-4 h-4 text-green-600" />
                      </span>
                      <div>
                        <p className="text-gray-900 font-medium">{strength}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          This strength indicates a strong foundation for your relationship.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Challenges */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Growth Areas
                </h3>
                <ul className="space-y-4">
                  {compatibility_details.challenges.map((challenge: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </span>
                      <div>
                        <p className="text-gray-900 font-medium">{challenge}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Working on this area will strengthen your connection.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Long Term Prediction */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
                  <Target className="w-6 h-6 mr-2" />
                  Long Term Potential
                </h3>
                <p className="text-gray-600 mb-6">{compatibility_details.long_term_prediction}</p>
              </motion.section>

              {/* Improvement Tips */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Tips for Success
                </h3>
                <div className="grid gap-4">
                  {compatibility_details.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start bg-blue-50 rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{tip}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Focus on this to strengthen your connection
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default DetailedCompatibilityView; 