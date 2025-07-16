import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, appRoutes } from '../../config/routesConfig';
import Dashboard from '../../pages/DashboardPage';
import Projects from '../../pages/ProjectPage';
import Locations from '../../pages/LocationPage';
import Racks from '../../pages/RacksPage';
import Baremetals from '../../pages/BaremetalPage';
import Virtualizations from '../../pages/VirtualizationPage';
import LayoutRoute from '../routes/LayoutRoutes';
import PrivateRoute from './PrivateRoutes';
import { LoginRoute } from '../routes/LoginRoutes';


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={publicRoutes['/login'].path} element={<LoginRoute />} />
        <Route path={publicRoutes['/logout'].path} element={<div>Logout</div>} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<LayoutRoute />}>
            <Route index element={<Navigate to={appRoutes['/dashboard'].path} replace />} />
            <Route path={appRoutes['/dashboard'].path} element={<Dashboard />} />
            <Route path={appRoutes['/project'].path} element={<Projects />} />


            {/* Inventory routes */}
            <Route path="inventory">
              <Route path="locations">
                <Route index element={<Locations />} />
                <Route path=":id" element={<div>Location Details</div>} />
                <Route path=":id/racks" element={<div>Racks for Location</div>} />
              </Route>
              <Route path="racks">
                <Route index element={<Racks />} />
                <Route path=":id" element={<div>Rack Details</div>} />
                <Route path=":id/baremetals" element={<div>Baremetals in Rack</div>} />
              </Route>
              <Route path="baremetals">
                <Route index element={<Baremetals />} />
                <Route path=":id" element={<div>Baremetal Details</div>} />
                <Route path=":id/virtualizations" element={<div>Virtualizations on Baremetal</div>} />
              </Route>
              <Route path="virtualization">
                <Route index element={<Virtualizations />} />
                <Route path=":id" element={<div>Virtualization Details</div>} />
                <Route path=":id/virtualmachines" element={<div>VMs in Virtualization</div>} />
              </Route>
              <Route path="virtualmachines">
                <Route index element={<div>All Virtual Machines</div>} />
                <Route path=":id" element={<div>VM Details</div>} />
              </Route>
              <Route path="networks">
                <Route index element={<div>All Network Devices</div>} />
                <Route path=":id" element={<div>network details Details</div>} />
              </Route>
            </Route>

            {/* Zabbix routes */}
            <Route path="zabbix">
              <Route path='dashboard' element={<div>Zabbix Dashboard</div>} />
              <Route path="problems" element={<div>Zabbix Problems</div>} />
              <Route path="hosts" element={<div>Zabbix Hosts</div>} />
              <Route path="hostgroup" element={<div>Zabbix Host Groups</div>} />
              <Route path="templates" element={<div>Zabbix Templates</div>} />
              <Route path="templategroup" element={<div>Zabbix Template Groups</div>} />
              <Route path="management">
                <Route path="users" element={<div>Zabbix Users</div>} />
                <Route path="usergroup" element={<div>Zabbix User Groups</div>} />
                <Route path="userrole" element={<div>Zabbix User Roles</div>} />
                <Route path="auth" element={<div>Zabbix Authentication</div>} />
                <Route path="token" element={<div>Zabbix API Tokens</div>} />
              </Route>
            </Route>

            {/* Other routes */}
            <Route path={appRoutes['/settings'].path} element={<div>Settings</div>} />
            <Route path={appRoutes['/administrator'].path} element={<div>Administrator</div>} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;