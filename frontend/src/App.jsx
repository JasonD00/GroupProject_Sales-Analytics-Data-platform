import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Customers from "./pages/dashboard/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";


function App() {
  console.log("App rendering");
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerProfile />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;