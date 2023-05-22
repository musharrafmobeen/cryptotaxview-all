import React from "react";

// import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
// import { authenticateAlreadySignedInUser } from "../../store/auth/auth";
// import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
// import { SocketContext } from "../../contexts/socket";
function ProtectedRoute({ user, children, redirectPath = "/" }) {
  if (user?.role?.shortCode !== "SAU") return <Outlet />;
  else return <></>;
}

export default ProtectedRoute;
