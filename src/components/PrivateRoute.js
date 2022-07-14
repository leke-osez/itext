import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateAuth } from "../context/Auth";

const PrivateRoute = ({ children }) => {
  const { user } = useStateAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children ? children : <Outlet />;
};

export default PrivateRoute;
