import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, UserCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './notifications/NotificationCenter';
import FavoriteProfiles from './profile/FavoriteProfiles';
import { profileService } from '../services/supabaseService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hide navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/home"
                className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-base font-semibold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-base font-semibold transition-colors"
              >
                FAQs
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-base font-semibold transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <div className="flex items-center">
              {user ? (
                <>
                  <button
                    onClick={() => setShowFavorites(true)}
                    className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>

                  <NotificationCenter />

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center text-gray-700 hover:text-pink-500 px-3 py-2 transition-colors"
                    >
                      <UserCircle className="w-6 h-6" />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={async () => {
                            setIsProfileMenuOpen(false);
                            try {
                              await profileService.generateAndStorePersonaAnalysis(user.id, true, 'MANUAL');
                              navigate('/profile');
                            } catch (error) {
                              console.error('Error generating persona:', error);
                            }
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                        >
                          Generate Persona
                        </button>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Favorites Sidebar */}
      {showFavorites && user?.id && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 bg-pink-600">
                  <h2 className="text-lg font-medium text-white">Favorites</h2>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FavoriteProfiles userId={user.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;