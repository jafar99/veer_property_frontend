import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Check authentication in localStorage (to avoid flickering)
  const storedAuth = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated && !storedAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
