import React from 'react';
import { useNavigate } from 'react-router-dom';

const FallbackSelectServer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToSelectServer = () => {
    navigate('/zabbix/server');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>No Server Selected</h1>
      <p>Please select a server to continue.</p>
      <button
        onClick={handleNavigateToSelectServer}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Select Server
      </button>
    </div>
  );
};

export default FallbackSelectServer;