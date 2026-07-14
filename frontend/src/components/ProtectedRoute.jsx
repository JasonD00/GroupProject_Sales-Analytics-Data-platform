/*
Wrapper component that will sit around routes that users wont have access to
Checks if there is a logged in user (AuthContext), if there is it renders the page the user is trying to visit
If not, it redirects them to the login page
Will use "<Outlet />" 

Will use "useAuth" to get the current user, then <Navigate> to redirect if there are no user
If there is a user, it renders an <Outlet/>
*/

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;