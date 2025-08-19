import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../slice/hooks';

import {
  Menu,
  LayoutDashboard,
  MapPin,
  Server,
  Users,
  LogOut,
  X,
  Database,
  HardDrive,
  Settings,
  Warehouse,
  BellRing,
  Monitor,
  Group,
  NotebookText,
  NotepadText,
  BriefcaseBusiness,
  ChartArea,
  User,
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  hasSubmenu = false,
  isExpanded = false,
  children
}) => {
  return (
    <div className="mb-1">
      <button
        onClick={onClick}
        className={`
          flex items-center w-full p-2 text-sm rounded-md
          ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
          transition-colors duration-200
        `}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {hasSubmenu && (
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        )}
      </button>

      {hasSubmenu && isExpanded && (
        <div className="pl-10 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPath }) => {
  const loginDetails = useAppSelector((state) => state.auth.loginDetails);
  const dispatch = useAppDispatch();
  const logout = () => dispatch({ type: 'auth/logout' });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    inventory: false,
  });

  // Extract first matching role dynamically
  const userRole = loginDetails?.role
    ?.match(/ROLE_\w+/)?.[0]
    ?.replace("ROLE_", "") || "Unknown";

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = async () => {
    logout();
    onNavigate('/login');
  };

  if (isCollapsed) {
    return (
      <div className="fixed inset-y-0 left-0 bg-white w-16 shadow-md flex flex-col z-10">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 py-4 flex flex-col items-center space-y-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`p-2 rounded-md ${currentPath === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <LayoutDashboard size={20} />
          </button>

          <button
            onClick={() => onNavigate('/inventory/locations')}
            className={`p-2 rounded-md ${currentPath === '/inventory/locations' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <MapPin size={20} />
          </button>

          <button
            onClick={() => onNavigate('/inventory/racks')}
            className={`p-2 rounded-md ${currentPath === '/inventory/racks' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Server size={20} />
          </button>

          {loginDetails?.role === 'ROLE_ADMIN' && (
            <button
              onClick={() => onNavigate('/users')}
              className={`p-2 rounded-md ${currentPath === '/users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users size={20} />
            </button>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 bg-white w-64 shadow-md flex flex-col z-10">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">InvenTrack</h1>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <NavItem
          icon={<ChartArea size={16} />}
          label="Dashboard"
          isActive={currentPath === '/dashboard'}
          onClick={() => onNavigate('/dashboard')}
        />

        <NavItem
          icon={<BriefcaseBusiness size={16} />}
          label="Projects"
          isActive={currentPath === '/project'}
          onClick={() => onNavigate('/project')}
        />

        <NavItem
          icon={<Database size={16} />}
          label="Inventory"
          hasSubmenu
          isExpanded={expandedMenus.inventory}
          onClick={() => toggleMenu('inventory')}
        >
          <NavItem
            icon={<MapPin size={16} />}
            label="Locations"
            isActive={currentPath === '/inventory/locations'}
            onClick={() => onNavigate('/inventory/locations')}
          />
          <NavItem
            icon={<Warehouse size={16} />}
            label="Racks"
            isActive={currentPath === '/inventory/racks'}
            onClick={() => onNavigate('/inventory/racks')}
          />
          <NavItem
            icon={<Server size={16} />}
            label="Devices"
            isActive={currentPath === '/inventory/devices'}
            onClick={() => onNavigate('/inventory/devices')}
          />
          <NavItem
            icon={<HardDrive size={16} />}
            label="Virtualization"
            isActive={currentPath === '/inventory/virtualization'}
            onClick={() => onNavigate('/inventory/virtualization')}
          />
          <NavItem
            icon={<HardDrive size={16} />}
            label="Hosts"
            isActive={currentPath === '/inventory/hosts'}
            onClick={() => onNavigate('/inventory/hosts')}
          />
        </NavItem>

        { loginDetails?.role.includes('ROLE_ROOT') && (

        <NavItem
          icon={<Settings size={16} />}
          label="Settings"
          isActive={currentPath === '/settings'}
          onClick={() => onNavigate('/settings')}
        />)}
        

        <NavItem
          icon={<Database size={16} />}
          label="Zabbix"
          hasSubmenu
          isExpanded={expandedMenus.zabbix}
          onClick={() => toggleMenu('zabbix')}
        >
          <NavItem
            icon={<ChartArea size={16} />}
            label="Zabbix Server"
            isActive={currentPath === '/zabbix/server'}
            onClick={() => onNavigate('/zabbix/server')}
          />
          <NavItem
            icon={<ChartArea size={16} />}
            label="Dashboard"
            isActive={currentPath === '/zabbix/dashboard'}
            onClick={() => onNavigate('/zabbix/dashboard')}
          />
          <NavItem
            icon={<BellRing size={16} />}
            label="Problems"
            isActive={currentPath === '/zabbix/problems'}
            onClick={() => onNavigate('/zabbix/problems')}
          />
          <NavItem
            icon={<Monitor size={16} />}
            label="Hosts"
            isActive={currentPath === '/zabbix/hosts'}
            onClick={() => onNavigate('/zabbix/hosts')}
          />
          <NavItem
            icon={<Group size={16} />}
            label="Host Group"
            isActive={currentPath === '/zabbix/hostgroup'}
            onClick={() => onNavigate('/zabbix/hostgroup')}
          />
          <NavItem
            icon={<NotebookText size={16} />}
            label="Template"
            isActive={currentPath === '/zabbix/templates'}
            onClick={() => onNavigate('/zabbix/templates')}
          />
          <NavItem
            icon={<NotepadText size={16} />}
            label="Template Group"
            isActive={currentPath === '/zabbix/templategroup'}
            onClick={() => onNavigate('/zabbix/templategroup')}
          />

          <NavItem
            icon={<Database size={16} />}
            label="Management"
            hasSubmenu
            isExpanded={expandedMenus.zabbix_management}
            onClick={() => toggleMenu('zabbix_management')}
          >
            <NavItem
              icon={<User size={16} />}
              label="Users"
              isActive={currentPath === '/zabbix/management/users'}
              onClick={() => onNavigate('/zabbix/management/users')}
            />
            <NavItem
              icon={<Users size={16} />}
              label="User Group"
              isActive={currentPath === '/zabbix/management/usergroup'}
              onClick={() => onNavigate('/zabbix/management/usergroup')}
            />
            <NavItem
              icon={<NotepadText size={16} />}
              label="User Role"
              isActive={currentPath === '/zabbix/management/userrole'}
              onClick={() => onNavigate('/zabbix/management/userrole')}
            />
            <NavItem
              icon={<NotepadText size={16} />}
              label="Authentication"
              isActive={currentPath === '/zabbix/management/auth'}
              onClick={() => onNavigate('/zabbix/management/auth')}
            />
            <NavItem
              icon={<NotepadText size={16} />}
              label="API Token"
              isActive={currentPath === '/zabbix/management/token'}
              onClick={() => onNavigate('/zabbix/management/token')}
            />

          </NavItem>

        </NavItem>
        {/* <NavItem
          icon={<Users size={16} />}
          label="User Management"
          isActive={currentPath === '/users'}
          onClick={() => onNavigate('/users')}
        /> */}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {loginDetails?.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{loginDetails?.username}</p>
            {/* <p className="text-xs text-gray-500">{loginResponseDTO?.role}</p> */}


            <p className="text-xs text-gray-500">{userRole}</p>

          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <LogOut className="mr-3" size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;