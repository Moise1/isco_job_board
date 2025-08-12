import {Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage"; 
import SignupPage from "./pages/SignupPage";
import JobsPage from "./pages/JobsPage";

export default function Root() {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/jobs" element={<JobsPage />} />
      </Routes>
  );
}
