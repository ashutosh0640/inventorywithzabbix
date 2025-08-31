import React from 'react';
import { CloudOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FallbackSelectServer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToSelectServer = () => {
    navigate('/zabbix/server');
  };

  return (
    <div className='flex flex-col items-center justify-center h-[500px] bg-red-100 p-4'>
      <CloudOff className=' text-red-500 size-[50px]'/>
      <h1 className=' text-red-600 font-bold'>No Zabbix Server Selected</h1>
      <p>Please select a server to continue.</p>
      <button
        onClick={handleNavigateToSelectServer}
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      >
        Select Server
      </button>
    </div>
  );
};

export default FallbackSelectServer;