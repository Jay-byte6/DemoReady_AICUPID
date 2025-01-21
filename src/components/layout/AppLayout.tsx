import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLandingPage && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <main className={`${!isLandingPage ? 'ml-64 pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 