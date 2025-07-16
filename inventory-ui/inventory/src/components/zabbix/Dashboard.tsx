import React, { useState, useEffect } from 'react';
import { Server, Monitor, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../slice/hooks';
import { useZabbixServerCount, useOnlineZabbixServerCount } from '../../features/zabbixQuery/zabbixServerQuery';
// import { apiService } from '../../services/api';

interface DashboardStats {
  totalServers: number;
  onlineServers: number;
  totalHosts: number;
  monitoredHosts: number;
  activeProblems: number;
  acknowledgedProblems: number;
  totalUsers: number;
  recentEvents: any[];
}

export function Dashboard() {
  const state = useAppSelector((state) => state.app);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [state.zabbixServer]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getDashboardStats(state.zabbixServer?.id);
      setStats(data);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      setError('API server not available - showing demo data');
      // Mock data for demonstration when API is not available
      setStats({
        totalServers: 0,
        onlineServers: 0,
        totalHosts: 0,
        monitoredHosts: 0,
        activeProblems: 0,
        acknowledgedProblems: 0,
        totalUsers: 0,
        recentEvents: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Zabbix Servers',
      value: `${stats.onlineServers}/${stats.totalServers}`,
      subtitle: 'Online/Total',
      icon: Server,
      color: 'blue',
      status: stats.onlineServers === stats.totalServers ? 'good' : 'warning'
    },
    {
      title: 'Monitored Hosts',
      value: `${stats.monitoredHosts}/${stats.totalHosts}`,
      subtitle: 'Active/Total',
      icon: Monitor,
      color: 'green',
      status: stats.monitoredHosts > stats.totalHosts * 0.8 ? 'good' : 'warning'
    },
    {
      title: 'Active Problems',
      value: stats.activeProblems.toString(),
      subtitle: `${stats.acknowledgedProblems} acknowledged`,
      icon: AlertTriangle,
      color: 'red',
      status: stats.activeProblems === 0 ? 'good' : 'error'
    },
    {
      title: 'System Users',
      value: stats.totalUsers.toString(),
      subtitle: 'Configured users',
      icon: Users,
      color: 'purple',
      status: 'good'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'red' ? 'bg-red-100' : 'bg-purple-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'red' ? 'text-red-600' : 'text-purple-600'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                stat.status === 'good' ? 'bg-green-500' :
                stat.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm ${
                stat.status === 'good' ? 'text-green-600' :
                stat.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stat.status === 'good' ? 'Healthy' :
                 stat.status === 'warning' ? 'Warning' : 'Critical'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { time: '5 min ago', event: 'Host web-01 became unavailable', severity: 'high', host: 'web-01' },
                { time: '12 min ago', event: 'CPU usage high on db-server', severity: 'warning', host: 'db-server' },
                { time: '25 min ago', event: 'Disk space low on storage-01', severity: 'average', host: 'storage-01' },
                { time: '1 hour ago', event: 'Service httpd restored on web-02', severity: 'information', host: 'web-02' },
                { time: '2 hours ago', event: 'Network interface down on switch-01', severity: 'disaster', host: 'switch-01' }
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    event.severity === 'disaster' ? 'bg-red-600' :
                    event.severity === 'high' ? 'bg-red-500' :
                    event.severity === 'average' ? 'bg-orange-500' :
                    event.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.event}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Monitor size={12} />
                        {event.host}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Production Zabbix', url: 'zabbix-prod.example.com', status: 'online', version: '6.4.8', hosts: 87 },
                { name: 'Staging Zabbix', url: 'zabbix-staging.example.com', status: 'online', version: '6.4.8', hosts: 23 },
                { name: 'Development Zabbix', url: 'zabbix-dev.example.com', status: 'maintenance', version: '6.4.7', hosts: 12 }
              ].map((server, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      server.status === 'online' ? 'bg-green-500' :
                      server.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{server.name}</p>
                      <p className="text-sm text-gray-600">{server.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{server.hosts} hosts</p>
                    <p className="text-xs text-gray-500">v{server.version}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}