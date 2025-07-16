import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../slice/hooks';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  currentPath,
  onNavigate
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} currentPath={currentPath} />

      <div className="flex-1 flex flex-col ml-64">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="py-3 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          InvenTrack &copy; {new Date().getFullYear()} - Inventory Management System
        </footer>
      </div>
    </div>
  );
};

export default Layout;