import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Przekieruj do logowania jeśli nie jest zalogowany
    return <Navigate to="/login" replace />;
  }

  return children;
}