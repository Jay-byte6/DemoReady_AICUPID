import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Star, User, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/supabaseService';
import type { SmartMatch } from '../types';
import DetailedCompatibilityView from '../components/compatibility/DetailedCompatibilityView';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topMatches, setTopMatches] = useState<SmartMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SmartMatch | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showCupidSearch, setShowCupidSearch] = useState(false);
  const [cupidId, setCupidId] = useState('');
  const [cupidSearchResult, setCupidSearchResult] = useState<SmartMatch | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Add ref for CUPID search section
  const cupidSearchRef = useRef<HTMLDivElement>(null);

  const scrollToCupidSearch = () => {
    cupidSearchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadTopMatches = async () => {
      if (!user?.id) return;
      try {
        const matches = await profileService.findTopMatches(user.id);
        setTopMatches(matches.slice(0, 3)); // Take top 3 matches
      } catch (error) {
        console.error('Error loading top matches:', error);
      }
    };

    loadTopMatches();
  }, [user?.id]);

  const handleViewProfile = (match: SmartMatch) => {
    setSelectedMatch(match);
    setShowDetailedView(true);
  };

  const handleAssessmentClick = (section: string) => {
    // Map the section names to the correct keys
    const sectionMap = {
      'personality': 'personalInfo',
      'preferences': 'preferences',
      'psychological': 'psychologicalProfile',
      'goals': 'relationshipGoals',
      'behavioral': 'behavioralInsights',
      'dealbreakers': 'dealbreakers'
    };
    
    // Store the selected section in localStorage
    localStorage.setItem('selectedSection', sectionMap[section as keyof typeof sectionMap]);
    navigate('/personality-analysis');
  };

  const handleCupidSearch = async () => {
    if (!cupidId.trim() || !user?.id) {
      toast.error('Please enter a valid CUPID ID');
      return;
    }
    
    setIsSearching(true);
    setCupidSearchResult(null); // Clear previous results
    
    try {
      const match = await profileService.findMatchByCupidId(user.id, cupidId);
      if (match) {
        setCupidSearchResult(match);
        toast.success('Profile found!');
      } else {
        toast.error('No profile found with this CUPID ID');
      }
    } catch (error) {
      console.error('Error searching by CUPID ID:', error);
      toast.error('Failed to search for profile. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderProgressBar = (value: number, color = 'pink') => (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border-2 border-pink-500/30">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full bg-${color}-500 rounded-full`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 ml-[240px]">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-12 border-4 border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 py-20"
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Welcome to Your Love Journey
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600">
                    Your path to meaningful connections starts here
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-16">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/personality-analysis')}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                    >
                      Start Assessment
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={scrollToCupidSearch}
                      className="px-8 py-4 border-2 border-pink-500/20 text-pink-600 rounded-xl font-semibold text-lg hover:border-pink-500/40 transition-all duration-300"
                    >
                      Find by CUPID ID
                    </motion.button>
                  </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                  <div className="border-4 border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 shadow-lg">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text mb-2">98%</div>
                    <div className="text-gray-600 font-medium">Match Accuracy</div>
                  </div>
                  <div className="border-4 border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 shadow-lg">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text mb-2">10K+</div>
                    <div className="text-gray-600 font-medium">Happy Couples</div>
                  </div>
                  <div className="border-4 border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 shadow-lg">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text mb-2">95%</div>
                    <div className="text-gray-600 font-medium">Success Rate</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* User Journey Section */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Complete Assessment',
                  description: 'Take our comprehensive personality assessment to help us understand you better',
                  icon: '📝'
                },
                {
                  step: '2',
                  title: 'AI Analysis',
                  description: 'Our AI analyzes your preferences and personality traits',
                  icon: '🤖'
                },
                {
                  step: '3',
                  title: 'Smart Matching',
                  description: 'Get matched with compatible partners based on deep compatibility analysis',
                  icon: '❤️'
                },
                {
                  step: '4',
                  title: 'Connect',
                  description: 'Start meaningful conversations with your matches',
                  icon: '💬'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative h-full"
                >
                  <div className="border-4 border-pink-500/30 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 shadow-lg text-center relative bg-white h-full group hover:shadow-2xl hover:scale-105 hover:shadow-pink-500/20">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-bold flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{item.title}</h3>
                    <p className="text-lg text-gray-600">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 text-pink-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Update font sizes in existing sections */}
        <style>
          {`
            .nav-link {
              font-size: 1.125rem !important; /* 18px */
              font-weight: 500 !important;
            }
            .nav-heading {
              font-size: 1.25rem !important; /* 20px */
              font-weight: 600 !important;
            }
            p {
              font-size: 1.125rem !important;
              font-weight: 500 !important;
              color: rgb(55 65 81) !important;
            }
            .text-sm {
              font-size: 1rem !important; /* 16px */
              font-weight: 500 !important;
            }
            .text-lg {
              font-size: 1.25rem !important; /* 20px */
              font-weight: 500 !important;
            }
            .text-xl {
              font-size: 1.375rem !important; /* 22px */
              font-weight: 600 !important;
            }
            .text-2xl {
              font-size: 1.625rem !important; /* 26px */
              font-weight: 700 !important;
            }
            .text-3xl {
              font-size: 2rem !important; /* 32px */
              font-weight: 700 !important;
            }
            .text-4xl {
              font-size: 2.5rem !important; /* 40px */
              font-weight: 800 !important;
            }
            .text-5xl {
              font-size: 3rem !important; /* 48px */
              font-weight: 800 !important;
            }
            .text-gray-600 {
              color: rgb(55 65 81) !important;
            }
            h3, h4 {
              font-weight: 700 !important;
            }
          `}
        </style>

        {/* Main Content Container */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            {/* Assessment Cards Section */}
            <div className="py-8">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Your Journey to Love
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Complete these assessments to help us understand you better and find your perfect match
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Assessment Card Template */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">🧠</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Let's Start with You!
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        {[
                          { label: 'Openness', value: 88 },
                          { label: 'Conscientiousness', value: 82 },
                          { label: 'Extraversion', value: 75 }
                        ].map((metric) => (
                          <div key={metric.label}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">{metric.label}</span>
                              <span className="text-pink-500">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          {[
                            'High emotional intelligence',
                            'Strong communication skills',
                            'Balanced decision-making style'
                          ].map((insight, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 * (index + 1) }}
                              className="flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                              {insight}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('personality')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Start Your Journey
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* What's Your Ideal Match Card */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">❤️</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          What's Your Ideal Match?
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        {[
                          { label: 'Values Match', value: 90 },
                          { label: 'Lifestyle Sync', value: 85 },
                          { label: 'Interest Overlap', value: 78 }
                        ].map((metric) => (
                          <div key={metric.label}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">{metric.label}</span>
                              <span className="text-pink-500">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          {[
                            'Clear relationship goals',
                            'Well-defined partner criteria',
                            'Lifestyle compatibility focus'
                          ].map((insight, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 * (index + 1) }}
                              className="flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                              {insight}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('preferences')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Share Your Preferences
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* How Do You Handle Love Card */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">🎯</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          How Do You Handle Love?
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        {[
                          { label: 'Emotional Stability', value: 85 },
                          { label: 'Self-Awareness', value: 92 },
                          { label: 'Relationship Readiness', value: 88 }
                        ].map((metric) => (
                          <div key={metric.label}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">{metric.label}</span>
                              <span className="text-pink-500">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          {[
                            'Secure attachment style',
                            'Healthy boundaries',
                            'Growth mindset'
                          ].map((insight, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 * (index + 1) }}
                              className="flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                              {insight}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('psychological')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Explore Your Emotions
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Where Are You Heading? Card - with similar styling */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">🎯</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Where Are You Heading?
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Goal Clarity</span>
                            <span className="text-pink-500">95%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '95%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Timeline Alignment</span>
                            <span className="text-pink-500">88%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '88%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Value Consistency</span>
                            <span className="text-pink-500">92%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Long-term commitment oriented
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Family-focused values
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Career-life balance
                          </motion.li>
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('goals')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Define Your Path
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* What's Your Style Card - with similar styling */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">🛡️</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          What's Your Style?
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Communication</span>
                            <span className="text-pink-500">90%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '90%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Empathy</span>
                            <span className="text-pink-500">85%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '85%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Adaptability</span>
                            <span className="text-pink-500">82%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '82%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Consistent communication patterns
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Positive conflict resolution
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Active listening skills
                          </motion.li>
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('behavioral')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Understand Your Style
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* What Won't Work for You Card - with similar styling */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="border-4 border-pink-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-pink-500/50 transition-all duration-300 bg-white shadow-lg"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-14 h-14 rounded-xl border-2 border-pink-500/20 flex items-center justify-center">
                          <span className="text-3xl">⛔</span>
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          What Won't Work for You?
                        </h3>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Boundary Clarity</span>
                            <span className="text-pink-500">95%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '95%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Value Alignment</span>
                            <span className="text-pink-500">92%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Standard Consistency</span>
                            <span className="text-pink-500">88%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '88%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-gray-700 font-medium mb-3">Key Insights:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Clear boundaries established
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Value-based criteria
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Lifestyle compatibility requirements
                          </motion.li>
                        </ul>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssessmentClick('dealbreakers')}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      >
                        Set Your Boundaries
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* CUPID ID Search Section */}
            <motion.div 
              ref={cupidSearchRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <div className="border-4 border-pink-500/30 rounded-2xl p-8 shadow-lg hover:border-pink-500/50 transition-all duration-300">
                <div className="max-w-3xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <Search className="w-8 h-8 text-pink-500" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Search by CUPID ID</h2>
                  </motion.div>
                  <p className="text-gray-800 text-lg mb-8 font-medium">
                    Looking for someone specific? Enter their CUPID ID to view their profile and compatibility analysis.
                    This feature helps you find profiles even if they're not in your top matches.
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={cupidId}
                      onChange={(e) => setCupidId(e.target.value)}
                      placeholder="Enter CUPID ID (e.g., CUPID-123456)"
                      className="flex-1 px-6 py-4 text-lg border-4 border-pink-500/30 bg-white text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none focus:border-pink-500/50 transition-all duration-300 shadow-sm"
                    />
                    <button
                      onClick={handleCupidSearch}
                      disabled={isSearching || !cupidId.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CUPID Search Result */}
            {cupidSearchResult && (
              <div className="mt-8 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Search Result</h2>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
                  <div className="flex">
                    {/* Profile Image */}
                    <div className="w-48 h-48 flex-shrink-0">
                      {cupidSearchResult.profile.profile_image ? (
                        <img
                          src={cupidSearchResult.profile.profile_image}
                          alt={cupidSearchResult.profile.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{cupidSearchResult.profile.fullname}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <span>{cupidSearchResult.profile.age} years</span>
                            <span>•</span>
                            <span>{cupidSearchResult.profile.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="border-4 border-pink-500/30 text-pink-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                            >
                              {cupidSearchResult.profile.occupation || 'Professional'}
                            </motion.span>
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="border-4 border-pink-500/30 text-pink-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                            >
                              {cupidSearchResult.profile.education || 'Graduate'}
                            </motion.span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {Math.round(cupidSearchResult.compatibility_score)}% Match
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About Me</h4>
                        <p className="text-gray-600">{cupidSearchResult.profile.bio || 'No bio available'}</p>
                      </div>

                      {/* Key Personality Traits */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Personality Traits</h4>
                        <div className="flex flex-wrap gap-2">
                          {(cupidSearchResult.profile.personality_traits || ['Ambitious', 'Creative', 'Empathetic']).map((trait: string, index: number) => (
                            <motion.span 
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="border-4 border-pink-500/30 text-gray-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                            >
                              {trait}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Interests/Hobbies */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Interests & Hobbies</h4>
                        <div className="flex flex-wrap gap-2">
                          {(cupidSearchResult.profile.interests || ['Reading', 'Traveling', 'Photography']).map((interest: string, index: number) => (
                            <span key={index} className="border-4 border-pink-500/30 text-pink-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compatibility Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Personality Sync</div>
                          <div className="text-pink-500 font-semibold">92%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Values Alignment</div>
                          <div className="text-pink-500 font-semibold">88%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lifestyle</div>
                          <div className="text-pink-500 font-semibold">85%</div>
                        </div>
                      </div>

                      {/* View Full Profile Button */}
                      <button
                        onClick={() => handleViewProfile(cupidSearchResult)}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Your Top Matches Section */}
            {topMatches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16"
              >
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Your Top Matches</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Match Cards */}
                  <div className="lg:col-span-2 space-y-6">
                    {topMatches.map((match) => (
                      <motion.div 
                        key={match.profile.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border-4 border-pink-500/30 hover:border-pink-500/50 ${
                          selectedMatch?.profile.id === match.profile.id ? 'ring-4 ring-pink-500' : ''
                        }`}
                        onClick={() => setSelectedMatch(match)}
                      >
                        <div className="flex">
                          {/* Profile Image with gradient overlay */}
                          <div className="w-48 h-48 flex-shrink-0 relative group">
                            {match.profile.profile_image ? (
                              <>
                                <img
                                  src={match.profile.profile_image}
                                  alt={match.profile.fullname}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                                <Users className="w-12 h-12 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Profile Info with enhanced styling */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1 hover:text-pink-600 transition-colors">
                                  {match.profile.fullname}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                  <span>{match.profile.age} years</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                  <span>{match.profile.location}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    className="border-4 border-pink-500/30 text-pink-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                                  >
                                    {match.profile.occupation || 'Professional'}
                                  </motion.span>
                                  <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    className="border-4 border-pink-500/30 text-pink-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                                  >
                                    {match.profile.education || 'Graduate'}
                                  </motion.span>
                                </div>
                              </div>
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md"
                              >
                                {Math.round(match.compatibility_score)}% Match
                              </motion.div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">About Me</h4>
                              <p className="text-gray-600 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                {match.profile.bio || 'No bio available'}
                              </p>
                            </div>

                            {/* Personality Traits with hover effects */}
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Personality Traits</h4>
                              <div className="flex flex-wrap gap-2">
                                {(match.profile.personality_traits || ['Ambitious', 'Creative', 'Empathetic']).map((trait, index) => (
                                  <motion.span 
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="border-4 border-pink-500/30 text-gray-600 px-3 py-1 rounded-full text-sm hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                                  >
                                    {trait}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            {/* View Profile Button with animation */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProfile(match);
                              }}
                              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              View Full Profile
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Compatibility Analysis Panel */}
                  {selectedMatch && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-xl shadow-lg p-8 border-4 border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 sticky top-4"
                    >
                      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Match Analysis</h3>
                      
                      {/* Overall Match */}
                      <div className="text-center mb-8">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-block border-2 border-pink-500/20 rounded-full p-6 mb-2 hover:border-pink-500/40 transition-all duration-300"
                        >
                          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            {Math.round(selectedMatch.compatibility_score)}%
                          </div>
                          <div className="text-pink-500 font-medium">Overall Match</div>
                        </motion.div>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="space-y-4">
                        {[
                          { label: 'Personality Sync', value: 92 },
                          { label: 'Values Alignment', value: 88 },
                          { label: 'Lifestyle Compatibility', value: 85 },
                          { label: 'Communication Style', value: 90 },
                          { label: 'Emotional Intelligence', value: 87 },
                          { label: 'Intellectual Connection', value: 89 },
                          { label: 'Growth Mindset', value: 86 }
                        ].map((metric, index) => (
                          <div key={metric.label}>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 font-medium">{metric.label}</span>
                              <span className="text-pink-500 font-semibold">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-pink-500/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Detailed Compatibility View Modal */}
            {selectedMatch && showDetailedView && (
              <DetailedCompatibilityView
                isOpen={showDetailedView}
                onClose={() => setShowDetailedView(false)}
                onBack={() => setShowDetailedView(false)}
                profile={selectedMatch.profile}
                compatibility_details={{
                  overall: selectedMatch.compatibility_score,
                  emotional: Math.round(selectedMatch.compatibility_score * 0.9),
                  intellectual: Math.round(selectedMatch.compatibility_score * 0.95),
                  lifestyle: Math.round(selectedMatch.compatibility_score * 0.85),
                  summary: selectedMatch.compatibility_details.long_term_prediction,
                  strengths: selectedMatch.compatibility_details.strengths,
                  challenges: selectedMatch.compatibility_details.challenges,
                  tips: selectedMatch.compatibility_details.tips,
                  long_term_prediction: selectedMatch.compatibility_details.long_term_prediction
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 