import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  ArrowLeft, 
  Star, 
  AlertTriangle, 
  Coffee,
  MessageCircle,
  Users,
  Calendar,
  Target,
  Sparkles,
  X,
  Music,
  Book,
  Dumbbell,
  HandHeart,
  Palette,
  Utensils,
  Mountain,
  Laptop
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { SmartMatchProfile, CompatibilityDetails } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  profile: SmartMatchProfile;
  compatibility_details: CompatibilityDetails;
}

const getActivityIcon = (activity: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'Art gallery visits': <Palette className="w-5 h-5" />,
    'Cooking classes': <Utensils className="w-5 h-5" />,
    'Nature hikes': <Mountain className="w-5 h-5" />,
    'Music concerts': <Music className="w-5 h-5" />,
    'Book discussions': <Book className="w-5 h-5" />,
    'Fitness activities': <Dumbbell className="w-5 h-5" />,
    'Volunteer work': <HandHeart className="w-5 h-5" />,
    'Skills workshops': <Laptop className="w-5 h-5" />
  };
  return icons[activity] || <Star className="w-5 h-5" />;
};

const getPersonalityAvatar = (traits: string[]) => {
  // This is a placeholder. In a real implementation, you would:
  // 1. Analyze the traits to determine the avatar style
  // 2. Generate or select an appropriate avatar
  // 3. Return the avatar URL or component
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
                  {getPersonalityAvatar(compatibility_details.behavioral_traits.social)}
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
              {/* Behavioral Traits */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                  <Users className="w-6 h-6 mr-2" />
                  Behavioral Traits
                </h3>
                <div className="space-y-6">
                  {Object.entries(compatibility_details.behavioral_traits).map(([category, traits], categoryIndex) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 capitalize">{category}</h4>
                        <span className="text-sm font-medium text-indigo-600">
                          {75 + Math.floor(Math.random() * 20)}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                        className="mb-4"
                      >
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${75 + Math.floor(Math.random() * 20)}%` }}
                            transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                      </motion.div>
                      <ul className="space-y-2">
                        {traits.map((trait, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <Star className="w-4 h-4 text-indigo-400 mr-2" />
                            <span>{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Communication Patterns */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Communication Patterns
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Strengths</h4>
                      <span className="text-sm font-medium text-green-600">
                        {85 + Math.floor(Math.random() * 15)}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                      className="mb-4"
                    >
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${85 + Math.floor(Math.random() * 15)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                    </motion.div>
                    <ul className="space-y-2">
                      {compatibility_details.communication_patterns.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <Star className="w-4 h-4 text-green-400 mr-2" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
                      <span className="text-sm font-medium text-amber-600">
                        {40 + Math.floor(Math.random() * 30)}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                      className="mb-4"
                    >
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${40 + Math.floor(Math.random() * 30)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        />
                      </div>
                    </motion.div>
                    <ul className="space-y-2">
                      {compatibility_details.communication_patterns.areas_for_improvement.map((area, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mr-2" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Long-term Marriage Prediction */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
                  <Calendar className="w-6 h-6 mr-2" />
                  Long-term Marriage Potential
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">Emotional Bond</h4>
                      <div className="w-20">
                        <CircularProgressbar
                          value={90}
                          text={`90%`}
                          styles={buildStyles({
                            textSize: '24px',
                            pathColor: '#8B5CF6',
                            textColor: '#8B5CF6',
                            trailColor: '#E5E7EB'
                          })}
                        />
                      </div>
                    </div>
                    <p className="text-gray-600">{compatibility_details.marriage_potential.emotional_bond}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Shared Values</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {compatibility_details.marriage_potential.shared_values.map((value, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-purple-50 rounded-lg p-3 flex items-start"
                        >
                          <Star className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-purple-900">{value}</div>
                            <div className="text-xs font-medium text-purple-600 mt-1">
                              {80 + Math.random() * 20}% match
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Date Ideas */}
              <motion.section 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-rose-600">
                  <Coffee className="w-6 h-6 mr-2" />
                  Recommended Date Ideas
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Based on Interests</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {compatibility_details.date_ideas.based_on_interests.map((idea, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-rose-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getActivityIcon(idea)}
                            <span className="text-sm font-medium text-rose-900">{idea}</span>
                          </div>
                          <div className="text-xs font-medium text-rose-600">
                            {85 + Math.random() * 15}% compatibility
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Growth Activities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {compatibility_details.date_ideas.growth_activities.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-emerald-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getActivityIcon(activity)}
                            <span className="text-sm font-medium text-emerald-900">{activity}</span>
                          </div>
                          <div className="text-xs font-medium text-emerald-600">
                            {80 + Math.random() * 20}% compatibility
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>

          {/* Compatibility Tips */}
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-emerald-600">
              <Target className="w-6 h-6 mr-2" />
              Compatibility Enhancement Tips
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Immediate Actions</h4>
                <div className="space-y-3">
                  {compatibility_details.tips.slice(0, 2).map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start bg-emerald-50 rounded-lg p-3"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-500 mt-1 mr-2" />
                      <span className="text-sm text-emerald-900">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Long-term Growth</h4>
                <div className="space-y-3">
                  {compatibility_details.tips.slice(2).map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start bg-blue-50 rounded-lg p-3"
                    >
                      <Target className="w-4 h-4 text-blue-500 mt-1 mr-2" />
                      <span className="text-sm text-blue-900">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default DetailedCompatibilityView; 