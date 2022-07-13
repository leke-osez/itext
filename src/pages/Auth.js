import React, { useState } from "react";
import { createUserWithEmailAndPassword as createUser } from "firebase/auth";
import { CircularProgress } from "@mui/icons-material";
import { auth } from "../lib/firebase";

const Auth = ({ signUp }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    loading: false,
    error: false,
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return setData({ ...data, error: "fill all fields" });
    }
    try {
      const result = await createUser({
        auth,
        email,
        password,
      });
      console.log(result.user);
    } catch (err) {
      console.log(err);
    }
  };
  const { name, email, password, error, loading } = data;

  return (
    <div
      className={`w-full h-screen flex justify-center items-center ${
        loading ? "bg-black/5" : ""
      }`}
    >
      <form onSubmit={handleSubmit}>
        {signUp && (
          <>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              className="name"
              type="text"
              onChange={handleChange}
              value={name}
            />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          className="email"
          type="email"
          onChange={handleChange}
          value={email}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          className="password"
          type="password"
          onChange={handleChange}
          value={password}
        />
        {error && <p className="bg-red">{error}</p>}
        <button onSubmit={handleSubmit} disabled={loading}>
          {signUp ? "Sign Up" : "Log in"}
        </button>
      </form>
      {loading && (
        <div className="text-lg absolute top-0 left-0 m-auto">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Auth;
