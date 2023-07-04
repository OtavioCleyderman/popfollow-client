import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
 const { token, isLoading  } = useContext(AuthContext);
 if (isLoading) {
  return null;
 }
 return token ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
