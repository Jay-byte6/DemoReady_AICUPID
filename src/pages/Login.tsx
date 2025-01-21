import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login functionality remains unchanged
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center p-4 relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between max-w-6xl relative z-10">
        {/* Left Section - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Hey There! 👋
              </h1>
              <p className="text-gray-300">Welcome back to AI Cupid</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center text-gray-300">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500" />
                  <span className="ml-2">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-pink-400 hover:text-pink-300 transition-colors">
                  Forgot Password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-3 font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                >
                  Sign in
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl py-3 font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <img src="/google.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </motion.button>
              </motion.div>
            </form>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center text-gray-300"
            >
              Don't have an account?{' '}
              <Link to="/signup" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Section - Mascot and Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/2 text-center lg:text-left lg:pl-12 mt-8 lg:mt-0"
        >
          <img
            src="/mascot.png"
            alt="AI Cupid Mascot"
            className="max-w-md mx-auto"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Finding Love with AI Intelligence
            </h2>
            <p className="text-gray-300 text-lg">
              Let AI Cupid guide you to your perfect match
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 