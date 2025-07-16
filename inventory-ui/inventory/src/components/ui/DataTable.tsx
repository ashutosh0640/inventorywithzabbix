import React from "react";


interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="p-3 border">Location Name</th>
            <th className="p-3 border">Rack Count</th>
            <th className="p-3 border">Bare Metal Count</th>
            <th className="p-3 border">Virtual Platform Count</th>
            <th className="p-3 border">Virtual Machine Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((location, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 border">{location.locationName}</td>
              <td className="p-3 border">{location.rackCount}</td>
              <td className="p-3 border">{location.bareMetalCount}</td>
              <td className="p-3 border">{location.virtualPlatformCount}</td>
              <td className="p-3 border">{location.virtualMachineCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
