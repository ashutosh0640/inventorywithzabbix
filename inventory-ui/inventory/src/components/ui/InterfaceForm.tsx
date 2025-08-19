import React from 'react';

interface InterfaceInputProps {
  ipAddress: string;
  gateway?: string;
  primaryDns?: string;
  secondaryDns?: string;
  onChange: (field: string, value: string) => void;
}

const InterfaceInput: React.FC<InterfaceInputProps> = ({
  ipAddress,
  gateway,
  primaryDns,
  secondaryDns,
  onChange,
}) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-xl max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          IP Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => onChange('ipAddress', e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gateway</label>
        <input
          type="text"
          value={gateway || ''}
          onChange={(e) => onChange('gateway', e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Primary DNS</label>
        <input
          type="text"
          value={primaryDns || ''}
          onChange={(e) => onChange('primaryDns', e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Secondary DNS</label>
        <input
          type="text"
          value={secondaryDns || ''}
          onChange={(e) => onChange('secondaryDns', e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default InterfaceInput;
