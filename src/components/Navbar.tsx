import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './notifications/NotificationCenter';
import { UserCircle, Heart, X } from 'lucide-react';
import FavoriteProfiles from './profile/FavoriteProfiles';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close menu when clicking outside
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

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">AI Cupid</span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/smart-matching"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/smart-matching')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Smart Matching
              </Link>
              <Link
                to="/relationship-insights"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/relationship-insights')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Relationship Insights
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/profile')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Profile
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <div className="relative" ref={menuRef}>
                  <button 
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <UserCircle className="h-6 w-6" />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/relationship-insights"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          Favorites
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;