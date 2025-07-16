// components/LayoutWrapper.tsx
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Layout from '../layout/Layout';

const LayoutRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract title from the current path if needed
  const getTitleFromPath = (path: string) => {
    // Implement your logic to derive title from path
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('project')) return 'Projects';
    if (path.includes('inventory')) return 'Inventory';
    if (path.includes('locations')) return 'Locations';
    if (path.includes('rack')) return 'Racks';
    if (path.includes('zabbix')) return 'Zabbix';
    if (path.includes('zabbix/management')) return 'Zabbix management';
    if (path.includes('setting')) return 'Setting';
    return 'Default Title';
  };

    // Extract title from the current path if needed
  const getSubTitleFromPath = (path: string) => {
    // Implement your logic to derive title from path
    if (path.includes('/inventory/location')) return 'Locations';
    if (path.includes('/inventory/rack')) return 'Racks';
    if (path.includes('/inventory/baremetal')) return 'Baremetals';
    if (path.includes('/inventory/virtualization')) return 'Virtualization';
    if (path.includes('/inventory/virtualmachine')) return 'Virtual Machine';
    if (path.includes('/zabbix/dashboard')) return 'Dashboard';
    if (path.includes('/zabbix/problems')) return 'Problems';
    if (path.includes('/zabbix/hosts')) return 'Hosts';
    if (path.includes('/zabbix/hostgroup')) return 'Host Group';
    if (path.includes('/zabbix/templates')) return 'Templates';
    if (path.includes('/zabbix/templategroup')) return 'Template Group';
    
    return '';
  };

  const title = getTitleFromPath(location.pathname);
  const subtitle = getSubTitleFromPath(location.pathname);

  return (
    <Layout
      title={title}
      subtitle={subtitle}
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <Outlet />
    </Layout>
  );
};

export default LayoutRoutes;