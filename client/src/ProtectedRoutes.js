import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Component to protect routes that require authentication
export function ProtectedRoutes({ children }) {
  const { user, token, loading } = useSelector((state) => state.users);
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If not authenticated, redirect to login with return path
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Component to protect admin-only routes
export function AdminRoute({ children }) {
  const { user, token, loading } = useSelector((state) => state.users);
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If not authenticated, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin (adjust this condition based on your user object structure)
  if (user.role !== "admin") {
    return <Navigate to="/jobs" replace />; // Redirect non-admins to jobs page
  }

  return children;
}

// Component to redirect authenticated users away from auth pages
export function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.users);
  const location = useLocation();

  // If already authenticated, redirect to intended page or jobs page
  if (user && token) {
    const from = location.state?.from?.pathname || "/jobs";
    return <Navigate to={from} replace />;
  }

  return children;
}
