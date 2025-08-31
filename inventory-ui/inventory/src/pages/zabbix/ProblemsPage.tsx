import { useState, useEffect } from 'react';
import { useAppSelector } from '../../slice/hooks';
import {
  AlertTriangle, Search, Filter, RefreshCw, CheckCircle,
  XCircle, Clock, AlertCircle, MessageSquare, User, Download, Monitor
} from 'lucide-react';
import type { ZabbixProblem, ZabbixProblemGetParams } from '../../types/zabbixProblem';
import { useGetZabbixProblems } from '../../features/zabbixQuery/zabbixProblemQuery'
import FallbackSelectServer from './FallbackSelectServer';

interface ProblemFilters {
  view: 'recent' | 'problems' | 'history';
  hostGroup: string;
  host: string;
  severity: string;
  status: string;
  acknowledged: string;
  timeRange: string;
  tags: string[];
}

const ProblemsPage = () => {
  const selectedServer = useAppSelector(state => state.zabbixserver.selectedServer);
  if (!selectedServer) {
    return <FallbackSelectServer />;
  }

  const getParams = {"output": "extend"} as ZabbixProblemGetParams;

  const { data: zabbixProblems, isLoading: problemsLoading } = useGetZabbixProblems(getParams);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<ProblemFilters>({
    view: 'recent',
    hostGroup: 'all',
    host: 'all',
    severity: 'all',
    status: 'all',
    acknowledged: 'all',
    timeRange: '24h',
    tags: []
  });


  // const handleRefresh = () => {
  //   fetchProblems();
  // };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const toggleProblemSelection = (problemId: string) => {
    setSelectedProblems(prev =>
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProblems(prev =>
      prev.length === filteredProblems.length ? [] : filteredProblems.map(problem => problem.id)
    );
  };

  const handleAcknowledge = (problemIds: string[]) => {
    setProblems(prev => prev.map(problem =>
      problemIds.includes(problem.id) ? { ...problem, acknowledged: true } : problem
    ));
    setSelectedProblems([]);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'disaster':
        return <AlertTriangle className="text-red-600" size={16} />;
      case 'high':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'average':
        return <AlertCircle className="text-orange-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'information':
        return <CheckCircle className="text-blue-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'disaster':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'average':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'information':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROBLEM':
        return <XCircle className="text-red-500" size={16} />;
      case 'OK':
        return <CheckCircle className="text-green-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.host.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesView = filters.view === 'recent' ||
      (filters.view === 'problems' && problem.status === 'PROBLEM') ||
      (filters.view === 'history');

    const matchesSeverity = filters.severity === 'all' || problem.severity === filters.severity;
    const matchesStatus = filters.status === 'all' || problem.status === filters.status;
    const matchesAcknowledged = filters.acknowledged === 'all' ||
      (filters.acknowledged === 'acknowledged' && problem.acknowledged) ||
      (filters.acknowledged === 'unacknowledged' && !problem.acknowledged);
    const matchesHost = filters.host === 'all' || filters.host === 'All Hosts' || problem.host === filters.host;

    return matchesSearch && matchesView && matchesSeverity && matchesStatus && matchesAcknowledged && matchesHost;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to view problems</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              API server not available - showing demo data. Connect your backend at http://localhost:8080 for live data.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Problems</h2>
          <p className="text-gray-600 mt-1">Monitor and manage system problems</p>
        </div>
        <div className="flex gap-2">
          {selectedProblems.length > 0 && (
            <button
              onClick={() => handleAcknowledge(selectedProblems)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <MessageSquare size={20} />
              Acknowledge ({selectedProblems.length})
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            <Filter size={20} />
            Filters
          </button>
          <button
            onClick={toggleAutoRefresh}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${autoRefresh
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
            Auto Refresh
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'recent', label: 'Show Recent Problems', icon: Clock },
              { key: 'problems', label: 'Problems', icon: AlertTriangle },
              { key: 'history', label: 'History', icon: History }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setFilters(prev => ({ ...prev, view: view.key as any }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${filters.view === view.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <view.icon size={16} />
                {view.label}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Group</label>
              <select
                value={filters.hostGroup}
                onChange={(e) => setFilters(prev => ({ ...prev, hostGroup: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {hostGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <select
                value={filters.host}
                onChange={(e) => setFilters(prev => ({ ...prev, host: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {hosts.map((host) => (
                  <option key={host} value={host}>{host}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="disaster">Disaster</option>
                <option value="high">High</option>
                <option value="average">Average</option>
                <option value="warning">Warning</option>
                <option value="information">Information</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acknowledged</label>
              <select
                value={filters.acknowledged}
                onChange={(e) => setFilters(prev => ({ ...prev, acknowledged: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unacknowledged">Unacknowledged</option>
                <option value="acknowledged">Acknowledged</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ack</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(problem.id)}
                      onChange={() => toggleProblemSelection(problem.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(problem.time)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(problem.severity)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(problem.severity)}`}>
                        {problem.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {problem.recoveryTime ? formatTime(problem.recoveryTime) : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(problem.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${problem.status === 'PROBLEM' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {problem.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {problem.info}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Monitor size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{problem.host}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{problem.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{problem.duration}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {problem.acknowledged ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        <User size={12} className="mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        <AlertCircle size={12} className="mr-1" />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.actions && problem.actions.length > 0 ? (
                        problem.actions.slice(0, 2).map((action, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {action}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags && problem.tags.length > 0 ? (
                        problem.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
          <p className="text-gray-600">
            {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== 'recent' && f.length > 0)
              ? 'Try adjusting your search or filter criteria'
              : 'No active problems - your system is healthy!'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default ProblemsPage;