import React, { useState, useEffect } from 'react';
import { Wallet, Server, HardDrive, Network, AlertTriangle, ArrowUp, ArrowDown, MonitorCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import type { Dashboard, RecentActivity } from '../types/responseDto';
import { dashboardAPI } from '../service/inventoryApi/dashboardApi';
import { activityAPI } from '../service/inventoryApi/activityApi';
import DataTable from '../components/ui/DataTable';
// import { useLocationsResourceCount } from '../features/inventoryQuery/locationQuery';

const DashboardPage: React.FC = () => {

  console.log('Dashboard page...')
  const [dashboardDetails, setDashboardDetails] = useState<Dashboard | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  // const { data: locationResourceCounts } = useLocationsResourceCount();

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardAPI.getDashboardData();
      setDashboardDetails(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardDetails(null);
    }
  };


  const fetchRecentActivity = async () => {
    try {
      const data = await activityAPI.getRecentActivitiesByPage(1, 5);
      console.log('Recent activity:', data);
      setRecentActivity(data.content);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
  };


  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivity();
  }, []);


  const stats = [
    {
      title: 'Projects',
      value: dashboardDetails?.projectCount || 0,
      icon: <Network size={20} />,
      change: '-2',
      trend: 'down',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Locations',
      value: dashboardDetails?.locationCount || 0,
      icon: <Wallet size={20} />,
      change: '+2',
      trend: 'up',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Racks',
      value: dashboardDetails?.rackCount || 0,
      icon: <Server size={20} />,
      change: '+5',
      trend: 'up',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Physical Servers',
      value: dashboardDetails?.baremetalCount || 0,
      icon: <HardDrive size={20} />,
      change: '+8',
      trend: 'up',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }, {
      title: 'Virtualization Platforms',
      value: dashboardDetails?.vpCount || 0,
      icon: <HardDrive size={20} />,
      change: '+8',
      trend: 'up',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Virtual Machines',
      value: dashboardDetails?.vmCount || 0,
      icon: <MonitorCheck size={20} />,
      change: '-2',
      trend: 'down',
      bgColor: 'bg-red-100',
      iconColor: 'text-orange-600'
    }
  ];

  const alerts = [
    {
      title: 'Server maintenance required',
      description: 'Server BM-12 requires scheduled maintenance',
      level: 'warning',
      date: '2 hours ago'
    },
    {
      title: 'Storage capacity warning',
      description: 'Storage array in Rack A4 is approaching 90% capacity',
      level: 'warning',
      date: '5 hours ago'
    },
    {
      title: 'Network switch offline',
      description: 'Network switch NS-07 in Location NYC is offline',
      level: 'critical',
      date: '1 day ago'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="h-full">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.iconColor} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
                {stat.change} this month
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="h-full">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1
                  ${activity.activityType === 'WRITE' ? 'bg-green-100 text-green-600' :
                    activity.activityType === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'}
                `}>
                  {activity.activityType === 'WRITE' ? '+' : activity.activityType === 'UPDATE' ? '↻' : '−'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between ">
                    <span className="text-xs text-gray-600">{activity.timestamp.split("T")[0]}</span>
                    <span className="text-xs text-gray-600">{activity.username}</span>
                  </div>
                  <p className="text-medium flex items-center justify-between ">
                    {/* <span className="font-medium">{activity.username}</span>  */}
                    <span className="text-sm text-gray-800">{activity.details}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Alerts" className="h-full">
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`
                p-4 rounded-md border-l-4 
                ${alert.level === 'critical' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}
              `}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className={`h-5 w-5 ${alert.level === 'critical' ? 'text-red-500' : 'text-amber-500'}`}
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${alert.level === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
                      {alert.title}
                    </h3>
                    <div className={`mt-1 text-sm ${alert.level === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>
                      <p>{alert.description}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {alert.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>


      {/* <DataTable data={locationResourceCounts ?? []} /> */}





      <Card title="Inventory Overview" className="h-full">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Racks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servers
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Network Devices
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">New York DC</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">16</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">48</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">18</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">65%</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">San Francisco DC</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">14</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">42</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">16</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">50%</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Chicago DC</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">12</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">36</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">14</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "88%" }}></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">88%</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Dallas DC</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">6</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">18</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">5</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">35%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;