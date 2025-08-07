// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedDocRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login/therapist" />;
};

export default ProtectedDocRoute;
