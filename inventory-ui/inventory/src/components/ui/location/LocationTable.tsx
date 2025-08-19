import React, { useState } from 'react';
import type { Location } from '../../../types/responseDto';
import { ConfirmDeleteModal } from '../ConfirmDeleteModel';
import { Edit, Trash2, Plus, RectangleGoggles } from 'lucide-react';

interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (locationId: number) => void;
  addRack: (location: Location) => void;
}



export const LocationTable: React.FC<LocationTableProps> = ({ locations, onEdit, onDelete, addRack }) => {

  const loginDetails = JSON.parse(sessionStorage.getItem('loginDetails') || 'null');
  const locationEditPermission = loginDetails?.role.includes('LOCATION_EDIT_LOCATION') || false;
  const locationDeletePermission = loginDetails?.role.includes('LOCATION_DELETE_LOCATION') || false;
  const rackAddPermission = loginDetails?.role.includes('RACK_WRITE_RACK') || false;
  const locationViewPermission = !loginDetails?.role.includes('LOCATION_WRITE_LOCATION') && !loginDetails?.role.includes('LOCATION_EDIT_LOCATION') && !loginDetails?.role.includes('LOCATION_DELETE_LOCATION') || false;
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const openModal = (locationId: number) => {
    setLocationToDelete(locationId);
    setIsModalOpen(true);
  }

  const handleModelClose = () => {
    setIsModalOpen(false);
  }

  const handleDelete = () => {
    if (locationToDelete !== null) {
      onDelete(locationToDelete);
      setIsModalOpen(false);
      setLocationToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className=" p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Locations
              </th>
              <th className=" p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Racks
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="p-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                <td>
                  <div>
                    <h3 className=" text-xs px-2 font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h3>
                  </div>
                </td>
                <td>
                  <div className=" flex items-center text-xs px-2 text-gray-600">
                    {(location.createdAt).split('T')[0]}
                  </div>
                </td>
                <td>
                  <div className="flex items-center text-xs px-2 text-gray-600">
                    <span className="line-clamp-1">
                      {location.rack?.length ?? 0} rack{location.rack?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center text-xs px-2 text-gray-600">
                    <span className="line-clamp-1">
                      {location.project?.length ?? 0} project{location.project?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {location.project?.length > 0 && (
                    <div className="text-xs px-2 text-gray-400 mt-1 line-clamp-1">
                      {location.project.map(loc => loc.name).join(', ')}
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex items-center">
                    <div className="flex -space-x-1 mr-2">
                      {location.user?.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border border-white"
                          title={user.fullName}
                        >
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {location.user?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border border-white">
                          +{location.user?.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {location.user?.length}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-left justify-center space-x-1">
                    {locationEditPermission && (
                    <button
                      onClick={() => onEdit(location)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit size={16} />
                    </button>)}
                    {locationDeletePermission && (
                    <button
                      onClick={() => openModal(location.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>)}

                    {rackAddPermission && (
                    <button
                      onClick={() => addRack(location)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={`Add Rack`}
                    >
                      <Plus size={16} />
                    </button>)}

                    {locationViewPermission && (
                      //<RectangleGoggles className=' ' />
                      <p className=' text-gray-500 text-xs'>View only</p>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleModelClose}
        onConfirm={handleDelete}
      />
    </div>
  );
};