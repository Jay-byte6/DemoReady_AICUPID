import React from 'react';
import { Bell, Lock, Eye, Trash2 } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
              <Lock className="w-5 h-5 mr-3" />
              Privacy
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
              <Eye className="w-5 h-5 mr-3" />
              Visibility
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5 mr-3" />
              Delete Account
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    New Matches
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get notified when you have new compatible matches
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Messages
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications for new messages
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Profile Views
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get notified when someone views your profile
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 