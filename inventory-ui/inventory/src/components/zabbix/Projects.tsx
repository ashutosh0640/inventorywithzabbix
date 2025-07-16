import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Server, Calendar, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Project } from '../../types';
import { apiService } from '../../services/api';

export function Projects() {
  const { state, dispatch } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProjects();
      setProjects(data);
      dispatch({ type: 'SET_PROJECTS', payload: data });
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // This will be handled by the API service fallback
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    if (project.zabbixServers.length > 0) {
      dispatch({ type: 'SET_CURRENT_SERVER', payload: project.zabbixServers[0] });
    }
    dispatch({ type: 'SET_ACTIVE_NAV_ITEM', payload: 'dashboard' });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
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

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Manage your infrastructure monitoring projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProjectSelect(project)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0 ml-2" size={20} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Server size={16} />
                  <span>{project.zabbixServers.length} Zabbix Server{project.zabbixServers.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                {project.zabbixServers.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Servers:</p>
                    {project.zabbixServers.map((server) => (
                      <div key={server.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 truncate">{server.name}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          server.status === 'online' ? 'bg-green-500' :
                          server.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle delete
                }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first monitoring project</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}