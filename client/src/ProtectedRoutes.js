import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoutes({ children }) {
  const { user, token, loading } = useSelector((state) => state.users);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { user, token, loading } = useSelector((state) => state.users);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; 
  }

  
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (user.role !== "admin") {
    return <Navigate to="/jobs" replace />; // Redirect non-admins to jobs page
  }

  return children;
}

// Component to redirect authenticated users away from auth pages
export function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.users);

    if (user && token) {
    
      const from = user.role === "admin" ? "/admin-dashboard" : "/jobs";
      return <Navigate to={from} replace />;
    }

  return children;
}
