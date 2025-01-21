import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import Breadcrumb from '../Breadcrumb';

const Layout = () => {
  const location = useLocation();
  const isPublicPage = ['/login', '/signup', '/'].includes(location.pathname);

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 