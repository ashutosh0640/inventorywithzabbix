// components/ui/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../slice/hooks'; // your typed hook


const PrivateRoute = () => {
  console.log("PrivateRoute ....")
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  console.log("isAuthenticated: ", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;