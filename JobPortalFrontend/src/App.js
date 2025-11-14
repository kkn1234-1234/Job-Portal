import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Protected Routes - Applicant */}
          <Route
            path="/applicant/dashboard"
            element={
              <ProtectedRoute role="APPLICANT">
                <ApplicantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant/applications"
            element={
              <ProtectedRoute role="APPLICANT">
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant/saved-jobs"
            element={
              <ProtectedRoute role="APPLICANT">
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Employer */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="EMPLOYER">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute role="EMPLOYER">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/manage-jobs"
            element={
              <ProtectedRoute role="EMPLOYER">
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applications/:jobId"
            element={
              <ProtectedRoute role="EMPLOYER">
                <ViewApplications />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Common */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <Layout />
    </AuthProvider>
  );
}
