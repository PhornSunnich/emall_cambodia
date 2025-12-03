// src/components/RequireAuth.js
import { useApp } from "../context/AppContext";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const { user } = useApp();
  
  if (!user || user.email !== "admin@emall.com") {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default RequireAuth;