import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;