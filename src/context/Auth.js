import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [test, setTest] = useState("test");

  const [userProfile, setUserProfile] = useState(null);
  const [appUsers, setAppUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat ]= useState(null);


  const value = {
    user,
    setUser,
    userProfile,
    setUserProfile,
    test,
    setTest,
    appUsers,
    setAppUsers,
    chat,
    setChat,
  };

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
