import {Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage"; 
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import JobsPage from "./pages/JobsPage";
import {
  ProtectedRoutes,
  AdminRoute,
  PublicRoute,
} from "./ProtectedRoutes";


// export default function Root() {
//   return (
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/jobs" element={<JobsPage/>} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       </Routes>
//   );
// }


export default function Root() {
  return (
    <Routes>
      {/* Public route - accessible to everyone */}
      <Route path="/" element={<App />} />
      
      {/* Auth routes - redirect authenticated users away */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      
      {/* Protected route - requires authentication */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoutes>
            <JobsPage />
          </ProtectedRoutes>
        }
      />
      
      {/* Admin-only route - requires authentication AND admin role */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}