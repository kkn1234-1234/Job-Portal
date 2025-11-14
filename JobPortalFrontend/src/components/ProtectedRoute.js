import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    const redirectPath = role === "EMPLOYER" ? "/employer/dashboard" : "/applicant/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
