import React from 'react';
import { useAppSelector } from '../../slice/hooks';;
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  // const { loginResponseDTO } = useAuth();
  const loginDetails = useAppSelector((state) => state.auth.loginDetails);

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
            <span className="sr-only">Notifications</span>
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </div>
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm hidden md:block">
              {loginDetails?.username}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {loginDetails?.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <ThemeToggle/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;