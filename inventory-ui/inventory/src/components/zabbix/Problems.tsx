import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Search, Filter, RefreshCw, CheckCircle, 
  XCircle, Clock, AlertCircle, Eye, MessageSquare, User, Calendar,
  Download, Settings, ChevronDown, ChevronUp, Zap, Activity
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Problem } from '../../types';
import { apiService } from '../../services/api';

export function Problems() {
  const { state } = useApp();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  useEffect(() => {
    if (state.currentServer) {
      fetchProblems();
    }
  }, [state.currentServer, severityFilter, acknowledgedFilter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchProblems, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const fetchProblems = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const data = await apiService.getProblems(state.currentServer.id);
      setProblems(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // Demo data will be handled by API service fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProblems();
  };

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

  const getSeverityPriority = (severity: string) => {
    const priorities = {
      'disaster': 6,
      'high': 5,
      'average': 4,
      'warning': 3,
      'information': 2,
      'not_classified': 1
    };
    return priorities[severity as keyof typeof priorities] || 0;
  };

  const filteredProblems = problems
    .filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.host.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || problem.severity === severityFilter;
      const matchesAcknowledged = acknowledgedFilter === 'all' || 
                                 (acknowledgedFilter === 'acknowledged' && problem.acknowledged) ||
                                 (acknowledgedFilter === 'unacknowledged' && !problem.acknowledged);
      return matchesSearch && matchesSeverity && matchesAcknowledged;
    })
    .sort((a, b) => {
      // Sort by severity (highest first), then by acknowledged status (unacknowledged first)
      const severityDiff = getSeverityPriority(b.severity) - getSeverityPriority(a.severity);
      if (severityDiff !== 0) return severityDiff;
      return a.acknowledged === b.acknowledged ? 0 : a.acknowledged ? 1 : -1;
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
          <p className="text-gray-600 mt-1">Monitor and manage active system problems</p>
        </div>
        <div className="flex gap-2">
          {selectedProblems.length > 0 && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <MessageSquare size={20} />
              Acknowledge ({selectedProblems.length})
            </button>
          )}
          <button
            onClick={toggleAutoRefresh}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              autoRefresh 
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Problems', 
            value: problems.length, 
            color: 'bg-red-100 text-red-800',
            icon: AlertTriangle 
          },
          { 
            label: 'Unacknowledged', 
            value: problems.filter(p => !p.acknowledged).length, 
            color: 'bg-orange-100 text-orange-800',
            icon: AlertCircle 
          },
          { 
            label: 'High Severity', 
            value: problems.filter(p => ['disaster', 'high'].includes(p.severity)).length, 
            color: 'bg-red-100 text-red-800',
            icon: Zap 
          },
          { 
            label: 'Acknowledged', 
            value: problems.filter(p => p.acknowledged).length, 
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle 
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="disaster">Disaster</option>
            <option value="high">High</option>
            <option value="average">Average</option>
            <option value="warning">Warning</option>
            <option value="information">Information</option>
            <option value="not_classified">Not Classified</option>
          </select>

          <select
            value={acknowledgedFilter}
            onChange={(e) => setAcknowledgedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Problems</option>
            <option value="unacknowledged">Unacknowledged</option>
            <option value="acknowledged">Acknowledged</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <AlertTriangle size={16} className="mr-2" />
            {filteredProblems.length} problems
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(problem.id)}
                      onChange={() => toggleProblemSelection(problem.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(problem.severity)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{problem.name}</div>
                        <div className="text-xs text-gray-500">ID: {problem.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(problem.severity)}`}>
                      {problem.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{problem.host}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{problem.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {problem.acknowledged ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        <User size={12} className="mr-1" />
                        Acknowledged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        <AlertCircle size={12} className="mr-1" />
                        Unacknowledged
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        {expandedProblem === problem.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="View problem">
                        <Eye size={16} />
                      </button>
                      {!problem.acknowledged && (
                        <button className="text-green-600 hover:text-green-900" title="Acknowledge">
                          <MessageSquare size={16} />
                        </button>
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
            {searchTerm || severityFilter !== 'all' || acknowledgedFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No active problems - your system is healthy!'
            }
          </p>
        </div>
      )}
    </div>
  );
}