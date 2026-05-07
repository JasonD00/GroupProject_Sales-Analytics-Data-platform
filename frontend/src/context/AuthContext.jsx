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
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showLoginModal, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}