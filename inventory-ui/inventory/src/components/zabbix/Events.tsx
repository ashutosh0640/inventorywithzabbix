import React, { useState, useEffect } from 'react';
import { 
  Activity, Search, Filter, RefreshCw, AlertTriangle, CheckCircle, 
  XCircle, Clock, AlertCircle, Eye, MessageSquare, User, Calendar,
  Download, Settings, ChevronDown, ChevronUp
} from 'lucide-react';
import { Event } from '../../types';
import { apiService } from '../../services/api';

export function Events() {
  const { state } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [isDemo, setIsDemo] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.currentServer) {
      fetchEvents();
    }
  }, [state.currentServer, severityFilter, statusFilter, timeFilter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchEvents, 30000); // Refresh every 30 seconds
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

  const fetchEvents = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const params = {
        severity: severityFilter !== 'all' ? severityFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        time: timeFilter,
        limit: 100
      };
      
      const data = await apiService.getEvents(state.currentServer.id, params);
      setEvents(data);
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
    fetchEvents();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
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
      case 'problem':
        return <XCircle className="text-red-500" size={16} />;
      case 'ok':
        return <CheckCircle className="text-green-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.host.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to view events</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-600 mt-1">Monitor system events and notifications</p>
        </div>
        <div className="flex gap-2">
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="problem">Problem</option>
            <option value="ok">OK</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Activity size={16} className="mr-2" />
            {filteredEvents.length} events
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="hover:bg-gray-50 transition-colors">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      {getStatusIcon(event.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        {event.acknowledged && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            <User size={12} className="mr-1" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatTimestamp(event.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity size={14} />
                          {event.host}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs rounded ${
                          event.status === 'problem' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      {expandedEvent === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={20} />
                    </button>
                    {!event.acknowledged && (
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <MessageSquare size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedEvent === event.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                        <dl className="space-y-1">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Event ID:</dt>
                            <dd className="text-gray-900">{event.id}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Timestamp:</dt>
                            <dd className="text-gray-900">{new Date(event.timestamp).toLocaleString()}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Host:</dt>
                            <dd className="text-gray-900">{event.host}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Server:</dt>
                            <dd className="text-gray-900">{state.currentServer?.name}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                        <div className="space-y-2">
                          {!event.acknowledged && (
                            <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                              Acknowledge Event
                            </button>
                          )}
                          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                            View Related Events
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                            Export Event Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No events available for the selected time period'
            }
          </p>
        </div>
      )}
    </div>
  );
}