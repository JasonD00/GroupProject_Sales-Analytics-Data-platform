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
  const [showLoginModel, setShowLoginModel] = useState(false);
 
  const login = (userData) => {
    // userData comes from POST /api/auth/login response
    // shape: { username, tier }
    // tier from backend is uppercase e.g. "ENTERPRISE"
    // normalising it for frontend "Enterprise"
    const normalisedTier = userData.tier
      ? userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1).toLowerCase()
      : "Growth";
 
    setUser({
      username: userData.username,
      tier:     normalisedTier,
    });
  };
 
  const logout = () => {
    setUser(null);
  };
 
  const openLoginModel  = () => setShowLoginModel(true);
  const closeLoginModel = () => setShowLoginModel(false);
 
  // Returns true if the logged in user's tier is >= required tier
  const hasFeature = (requiredTier) => {
    if (!user) return false;
    const tierLevel = { Growth: 1, Pro: 2, Enterprise: 3 };
    const userLevel = tierLevel[user.tier] || 1;
    const required  = tierLevel[requiredTier] || 1;
    return userLevel >= required;
  };
 
  return (
    <AuthContext.Provider value={{
      user,
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