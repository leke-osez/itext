import React, { useState } from "react";
import {
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
} from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import { auth, db } from "../lib/firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Auth = ({ signUp }) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    loading: false,
    error: false,
  };
  const [data, setData] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name.trim() || !email.trim() || !password.trim()) {
      return setData({ ...data, error: "fill all fields" });
    }
    try {
      const result = await createUser(auth, email, password);
      const done = await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email,
        name,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      console.log(done);
      setData(initialState);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setData({ ...data, error: err.message, loading: false });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email.trim() || !password.trim()) {
      return setData({ ...data, error: "fill all fields" });
    }
    try {
      const result = await signIn(auth, email, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData(initialState);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setData({ ...data, error: err.message, loading: false });
    }
  };

  // destructuring object -- data
  const { name, email, password, error, loading } = data;

  return (
    <div
      className={`w-full h-screen flex justify-center items-center ${
        loading ? "bg-black/5" : ""
      }`}
    >
      <form
        className="w-full flex justify-center  items-center"
        onSubmit={signUp ? handleSignUp : handleSignIn}
      >
        <div className="flex flex-col items-center gap-2 md:gap-3 h-fit min-w-[250px] sm:w-[50%] w-[90%]  shadow-lg rounded-lg px-2  py-3 md:p-3 bg-gray-400/20 auth_form">
          <h2 className="text-lg font-semibold mb-3 text-center md:text-xl">
            {signUp ? "Create your account" : "Login to your account"}
          </h2>

          <div className="flex flex-col items-center gap-2 text-start w-[70%]">
            {signUp && (
              <div className="flex flex-col w-fit">
                <div>
                  <label htmlFor="name">Name</label>
                </div>
                <input
                  id="name"
                  name="name"
                  className="name w-full rounded-lg h-8"
                  type="text"
                  onChange={handleChange}
                  value={name}
                  autoFocus
                />
              </div>
            )}

            <div className="flex flex-col w-fit">
              <div>
                <label htmlFor="email">Email</label>
              </div>
              <input
                id="email"
                name="email"
                className="email w-full rounded-lg h-8 bg-white"
                type="email"
                onChange={handleChange}
                value={email}
                autoFocus
              />
            </div>

            <div className="flex flex-col w-fit">
              <div>
                <label htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                name="password"
                className="password w-full rounded-lg h-8"
                type="password"
                onChange={handleChange}
                value={password}
              />
            </div>
          </div>
          {error && <p className="text-red-700">{error}</p>}
          <button
            onSubmit={signUp ? handleSignUp : handleSignIn}
            disabled={loading}
            className="bg-green-500 w-full py-2 font-bold text-white rounded-full max-w-[200px]"
          >
            {signUp ? "Sign Up" : "Log in"}
          </button>
        </div>
      </form>
      {loading && (
        <div className="fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Auth;
