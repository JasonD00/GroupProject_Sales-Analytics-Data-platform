/*
The AuthContext will store the currently logged in users data (username, role) and make it
accessible by any component.

It will:
    - Store the current user state (null when logged in)
    - Provide "login()" function that saves the user to a state 
    - Give a "logout()" function that clears the state
    - Wrap the entire app so every page can access it
 */

import { createContext, useState, useContext } from "react";
 
export const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user,           setUser]           = useState(null);
  const [token,          setToken]          = useState(null);
  const [showLoginModel, setShowLoginModel] = useState(false);
 
  const login = (userData) => {
  setUser({
    username: userData.username,
    tier:     userData.tier,
  });
  setToken(userData.token);
};
 
  const logout = () => {
    setUser(null);
    setToken(null);
  };
 
  const openLoginModel  = () => setShowLoginModel(true);
  const closeLoginModel = () => setShowLoginModel(false);
 
  // Returns true if the logged in users tier is >= required tier
  const hasFeature = (requiredTier) => {
  if (!user) return false;
  const tierLevel = {
    // Handle both uppercase (from backend) and capitalised (in frontend)
    GROWTH: 1, Growth: 1,
    PRO: 2,    Pro: 2,
    ENTERPRISE: 3, Enterprise: 3,
  };
  const userLevel = tierLevel[user.tier] || 1;
  const required  = tierLevel[requiredTier] || 1;
  return userLevel >= required;
};
 
  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      showLoginModel,
      openLoginModel,
      closeLoginModel,
      hasFeature,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}