import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Brain, Target, Users, Star, Shield, Sparkles, MessageCircle, UserCheck, Activity, Zap, ChevronUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageLoad = (imageName: string) => {
    setImagesLoaded(prev => ({ ...prev, [imageName]: true }));
  };

  const Counter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<number>(0);

    useEffect(() => {
      if (isStatsInView) {
        const step = end / (duration * 60);
        const interval = setInterval(() => {
          countRef.current = Math.min(countRef.current + step, end);
          setCount(Math.floor(countRef.current));
          if (countRef.current >= end) clearInterval(interval);
        }, 1000 / 60);
        return () => clearInterval(interval);
      }
    }, [isStatsInView, end, duration]);

    return <span>{count}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation Dots */}
      <nav className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block" aria-label="Section navigation">
        <div className="flex flex-col gap-4">
          {['hero', 'ai-matching', 'how-it-works', 'why-choose', 'success-stories'].map((section, index) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
              className="w-3 h-3 rounded-full bg-pink-200 hover:bg-pink-500 transition-colors"
              aria-label={`Scroll to ${section.replace('-', ' ')}`}
            />
          ))}
        </div>
      </nav>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors z-40"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>

      {/* Inline Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white py-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Image Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="grid grid-cols-3 gap-3 p-4 opacity-45">
            <motion.div
              initial={{ opacity: 10, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple1.jpg"
                alt="Happy Couple 1"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple2.jpg"
                alt="Happy Couple 2"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple3.jpg"
                alt="Happy Couple 3"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple4.png"
                alt="Happy Couple 4"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple5.png"
                alt="Happy Couple 5"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="/images/couple6.png"
                alt="Happy Couple 6"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
               Revolutionize Love with AI Cupid
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Discover meaningful connections through AI-powered matchmaking
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                Start Your Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hero Section Component */}
      <HeroSection />

      {/* Content Sections */}
      <section id="ai-matching" aria-label="AI-Powered Matchmaking" className="py-16 bg-gradient-to-br from-rose-100 via-white to-pink-50 relative">
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">AI-Powered Matchmaking</h2>
            <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">Experience the future of finding love with our cutting-edge technology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">AI Analysis</h3>
              </div>
              <p className="text-gray-600 mb-6">Advanced algorithms process thousands of data points to find your ideal match</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">98%</div>
                  <div className="text-sm text-gray-600">Match Accuracy</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">92%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">Compatibility Score</h3>
              </div>
              <p className="text-gray-600 mb-6">Deep psychological profiling ensures genuine compatibility</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">95%</div>
                  <div className="text-sm text-gray-600">Personality Match</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">96%</div>
                  <div className="text-sm text-gray-600">Long-term Potential</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">Relationship Insights</h3>
              </div>
              <p className="text-gray-600 mb-6">Comprehensive analysis of relationship dynamics and potential</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">94%</div>
                  <div className="text-sm text-gray-600">Communication</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 group-hover:bg-pink-100 transition-colors">
                  <div className="text-2xl font-bold text-pink-500">97%</div>
                  <div className="text-sm text-gray-600">Emotional Bond</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with animated counters */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-pink-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isStatsInView ? 1 : 0, y: isStatsInView ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl font-bold text-pink-500 mb-3">
                <Counter end={98} duration={1.5} />%
              </div>
              <div className="text-gray-700 font-medium">Match Accuracy</div>
              <div className="text-sm text-gray-500 mt-1">Based on user feedback</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isStatsInView ? 1 : 0, y: isStatsInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl font-bold text-pink-500 mb-3">
                <Counter end={95} duration={1.5} />%
              </div>
              <div className="text-gray-700 font-medium">Success Rate</div>
              <div className="text-sm text-gray-500 mt-1">Based on user feedback</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isStatsInView ? 1 : 0, y: isStatsInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl font-bold text-pink-500 mb-3">
                <Counter end={94} duration={1.5} />%
              </div>
              <div className="text-gray-700 font-medium">User Satisfaction</div>
              <div className="text-sm text-gray-500 mt-1">Based on user feedback</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isStatsInView ? 1 : 0, y: isStatsInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl font-bold text-pink-500 mb-3">
                <Counter end={97} duration={1.5} />%
              </div>
              <div className="text-gray-700 font-medium">Long-term Success</div>
              <div className="text-sm text-gray-500 mt-1">Based on user feedback</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How AI CUPID Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-rose-50 via-white to-pink-50 relative">
        <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">How AI CUPID Works</h2>
            <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">Four simple steps to find your perfect match</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 relative">
            {/* Progress Line */}
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-pink-200 -translate-y-1/2">
                  <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full bg-pink-500"
              />
            </div>

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-l-4 border-pink-400 group"
            >
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">01</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-pink-500 transition-colors">Create Your Profile</h3>
              <p className="text-gray-600">Sign up and complete your detailed profile with photos and basic information.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-l-4 border-pink-400 group"
            >
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">02</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-pink-500 transition-colors">Take the Test</h3>
              <p className="text-gray-600">Complete our comprehensive personality assessment and activity preferences.</p>
            </motion.div>

            {/* Step 3 */}
                  <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-l-4 border-pink-400 group"
            >
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">03</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-pink-500 transition-colors">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes your profile, behavior, and compatibility patterns.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative p-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border-l-4 border-pink-400 group"
            >
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">04</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-pink-500 transition-colors">Meet Matches</h3>
              <p className="text-gray-600">Connect with highly compatible matches and start your journey.</p>
                  </motion.div>
                </div>
              </div>
      </section>

      {/* Why Choose AI Cupid? Section */}
      <section id="why-choose" className="py-24 bg-gradient-to-br from-pink-100 via-white to-rose-50">
        <div className="container mx-auto px-4">
            <motion.div 
            initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
              Why Choose AI Cupid?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the perfect blend of technology and romance with our advanced AI-powered matchmaking platform</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* AI-Powered Matching Card */}
                  <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600 text-lg">Our sophisticated algorithm analyzes multiple dimensions of compatibility.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-pink-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 3.77 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-pink-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">98%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Match Accuracy</p>
                  </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-pink-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 7.54 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-pink-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">96%</span>
                </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Compatibility Score</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-pink-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 11.31 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-pink-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">94%</span>
              </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Success Rate</p>
            </motion.div>
          </div>
            </motion.div>

            {/* Add other cards with their original content and metrics */}
            {/* Personality Analysis Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Personality Analysis</h3>
                  <p className="text-gray-600 text-lg">Deep psychological insights through comprehensive psychometric testing.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 7.54 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">96%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Profile Accuracy</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 9.425 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">95%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Compatibility Match</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 11.31 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">94%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Behavioral Analysis</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Activity Tracking Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-gray-700" />
        </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Activity Tracking</h3>
                  <p className="text-gray-600 text-lg">Smart lifestyle compatibility matching based on real-world behaviors.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 7.54 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">96%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Interest Match</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 9.425 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">95%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Activity Sync</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 11.31 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">94%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Lifestyle Fit</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Real-time Updates Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Real-time Updates</h3>
                  <p className="text-gray-600 text-lg">Instant notifications and dynamic matching based on continuous learning.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 5.655 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">97%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Response Time</p>
            </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 7.54 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">96%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Update Accuracy</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 9.425 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">95%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Match Relevance</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Privacy & Security Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Privacy & Security</h3>
                  <p className="text-gray-600 text-lg">Secure data handling with strong encryption and privacy focus.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 1.885 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">99%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Data Security</p>
            </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 3.77 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">98%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Encryption</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 5.655 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">97%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">Privacy Score</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Interactive Experience Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-300 border-b-4 border-pink-400 group"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive Experience</h3>
                  <p className="text-gray-600 text-lg">Beautiful animations and intuitive design for engaging user experience.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 7.54 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">96%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">User Engagement</p>
            </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 9.425 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">95%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">UI Satisfaction</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative inline-flex">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-purple-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 11.31 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-purple-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="42"
                        cy="42"
                        strokeDasharray="188.5"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">94%</span>
                  </div>
                  <p className="text-sm mt-2 font-semibold text-gray-700">User Experience</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">Success Stories</h2>
            <p className="text-gray-600 text-lg">Real couples who found love through AI Cupid</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* David & Sarah */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple1.jpg" 
                    alt="David & Sarah"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">David & Sarah, 28</h3>
                    <p className="text-white/90">New York, NY</p>
              </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Engaged</span>
                    <span className="text-gray-600">Tech Industry</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"AI Cupid's personality matching was spot on! We connected instantly over our shared love for technology and innovation."</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Tech Lovers</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Perfect Match</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Michael & Emma */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple2.jpg" 
                    alt="Michael & Emma"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">Michael & Emma, 32</h3>
                    <p className="text-white/90">London, UK</p>
              </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Married 2 years</span>
                    <span className="text-gray-600">Fitness</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"The activity matching feature brought us together through our passion for fitness. Now we run marathons together!"</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Fitness Enthusiasts</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Active Lifestyle</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* James & Lisa */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple3.jpg" 
                    alt="James & Lisa"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">James & Lisa, 35</h3>
                    <p className="text-white/90">Chicago, IL</p>
              </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Dating 1 year</span>
                    <span className="text-gray-600">Creative Duo</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"We both work in creative fields and AI Cupid matched us based on our artistic passions. We've been inseparable since our first date."</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Creative Souls</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Artists</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Alex & Jordan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple4.png" 
                    alt="Alex & Jordan"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">Alex & Jordan, 29</h3>
                    <p className="text-white/90">Austin, TX</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Together 2 years</span>
                    <span className="text-gray-600">Tech Industry</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"The compatibility analysis was incredibly accurate. We share the same values, goals, and even have matching quirky interests!"</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Shared Values</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Tech Industry</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Maria & Tom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple5.png" 
                    alt="Maria & Tom"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">Maria & Tom, 31</h3>
                    <p className="text-white/90">Seattle, WA</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Married 1 year</span>
                    <span className="text-gray-600">Eco Warriors</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"We were both looking for someone who shared our passion for environmental causes. AI Cupid brought us together and we're now working on sustainability projects together!"</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Eco Warriors</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Shared Mission</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rachel & Chris */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <img 
                    src="/images/couple6.png" 
                    alt="Rachel & Chris"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <h3 className="text-white text-xl font-bold">Rachel & Chris, 27</h3>
                    <p className="text-white/90">Boston, MA</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-pink-500 font-semibold">Dating 8 months</span>
                    <span className="text-gray-600">Medical Field</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">"As busy medical professionals, we needed a dating service that understood our schedules. AI Cupid matched us perfectly based on our lifestyle compatibility."</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Medical Field</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">Busy Professionals</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ready to Find Your Perfect Match Section */}
      <section className="py-24 bg-gradient-to-br from-pink-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-white/90 mb-12">Join thousands of happy couples who found love through AI Cupid</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
              className="inline-block bg-white text-pink-500 rounded-full py-4 px-12 font-semibold text-lg hover:bg-pink-50 transition-colors mb-16"
          >
            Get Started Now
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10k+</div>
                <div className="text-white/90">Happy Couples</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">98%</div>
                <div className="text-white/90">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="text-white/90">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;