import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import { AuthProvider } from "./context/AuthContext";

function App(){
  return(
    <AuthProvider>  
      <Routes>
        <Route path = "/" element={<Login />} />
        <Route path = "/dashboard" element={<Dashboard />} />
        <Route path = "/forgot-password" element={<ForgotPassword />} />
        <Route path = "/create-account" element={<CreateAccount />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
