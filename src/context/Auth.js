import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = { user, setUser };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loading />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useStateAuth = () => useContext(AuthContext);
