import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/inventoryapi';

const useAttach401Interceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          sessionStorage.removeItem('loginDetails');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};

export default useAttach401Interceptor;
