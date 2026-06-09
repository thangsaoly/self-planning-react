import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // Redirect to landing page and ideally open login modal
        return <Navigate to="/" replace />;
    }

    return children;
}
