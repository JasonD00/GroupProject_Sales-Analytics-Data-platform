/*
  Overview:
  Manages the global auth state, stores the logged in users, handles login/logout requests, controls the login model
  and provides "hasFeature()" to check if the users tier unlocks any features 
*/

import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showLoginModel, setShowLoginModel] = useState(false);

  const login = (userData) => {
    setUser({
      ...userData,
      tier: userData.tier || "Growth",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModel = () => setShowLoginModel(true);
  const closeLoginModel = () => setShowLoginModel(false);

  // Returns true if the user thats logged in is >= than the required tier
  const hasFeature = (requiredTier) => {
    if (!user) return false;
    const tierLevel = { Growth: 1, Pro: 2, Enterprise: 3 };
    const userLevel = tierLevel[user.tier] || 1;
    const required = tierLevel[requiredTier] || 1;
    return userLevel >= required;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showLoginModel, openLoginModel, closeLoginModel, hasFeature }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}