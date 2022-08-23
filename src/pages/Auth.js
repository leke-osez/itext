import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
} from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import { auth, db } from "../lib/firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/img/logo3.png";

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
  const location = useLocation();
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const switchForm = (type) => {
    if (type === "signin") {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
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
        bio:'',
        followers: [],
        following: [],
        isVerified: false,
        avatar: '',
        avatarPath: '',
        bgImg: '',
        bgImgPath: ''
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
      className={`w-full md:h-screen flex flex-col-reverse md:flex-row justify-center items-center ${
        loading ? "bg-black/5" : ""
      }`}
    >
      {/* Landing page banner design */}
      <div className="md:w-[55%] bg-orange-400/40 h-full memphis_bg flex justify-center mt-[3rem] md:mt-0">
        <div className="w-[80%] my-[3rem]">
          <p className="text-white stroke text-[3rem] md:text-[5rem] auth__banner-title mt-3">
            Meet amazing people on trickle
          </p>

        </div>
      </div>

      {/* Authentication form */}
      <div className="w-[45%] p-0 h-full ">
        <form
          className="w-full flex justify-center items-center md:mt-10"
          onSubmit={signUp ? handleSignUp : handleSignIn}
        >
          <div className="flex flex-col items-center gap-2 md:gap-3 h-fit min-w-[250px] w-full md:w-[90%] rounded-lg md:px-2  py-3 md:p-3 bg-inherit auth_form">
            {/* App Logo */}
            <div>
              <img src={logo} alt="app-logo" className="w-[5rem] h-[5rem]" />
            </div>

            <h2 className="text-lg text-[#eca642] font-normal mb-3 md:mb-10 text-center md:text-[1.7rem]">
              {signUp ? "Create an account" : "Login to your account"}
            </h2>

            <div className="flex flex-col items-center gap-3 md:gap-5 mb-7 text-start w-full">
              {signUp && (
                <div className="flex flex-col w-[100%] md:w-[70%]">
                  <div className="font-light">
                    <label htmlFor="name">
                      <p className="font-light xl:text-[1.3rem] text-[#eca642]">
                        Name
                      </p>
                    </label>
                  </div>
                  <input
                    id="name"
                    name="name"
                    className="name w-full  rounded-full h-[2.7rem] max-w-[400px] border-[.17rem] xl:border-[.3rem]  border-[#eca642]/70 px-5"
                    type="text"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                  />
                </div>
              )}

              <div className="flex flex-col w-[100%] md:w-[70%]">
                <div>
                  <label htmlFor="email">
                    <p className="font-thin xl:text-[1.3rem] text-[#eca642]">
                      Email
                    </p>
                  </label>
                </div>
                <input
                  id="email"
                  name="email"
                  className="email w-full rounded-full h-[2.7rem] bg-white max-w-[400px] border-[.17rem] xl:border-[.3rem] border-[#eca642]/70 px-5"
                  type="email"
                  onChange={handleChange}
                  value={email}
                  autoFocus={location.pathname === "/signin" ? true : false}
                />
              </div>

              <div className="flex flex-col w-[100%] md:w-[70%]">
                <div>
                  <label htmlFor="password">
                    <p className="font-thin xl:text-[1.3rem] text-[#eca642]">
                      Password
                    </p>
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  className="password w-full  rounded-full h-[2.7rem] max-w-[400px] border-[.17rem] xl:border-[.3rem]  border-[#eca642]/70 px-5"
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
              className="bg-[#fca120] text-[1.2rem] w-full py-2 font-bold text-white rounded-[.5rem] max-w-[200px]"
            >
              {signUp ? "Sign Up" : "Log in"}
            </button>

            {/* SWITCH MODE OF AUTHENTICATION */}
            <span className="w-full flex justify-center text-sm md:text-base text-center">
              {location.pathname === "/signin" ? (
                <div className="flex">
                  <p className="mr-2 md:mr-2 text-black/60">
                    Don't have an account?,
                  </p>
                  <button
                    className="text-[#eca642] md:font-semibold"
                    onClick={() => switchForm("signup")}
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <p className="mr-2 md:mr-2 text-black/60">
                    Already have an account?,
                  </p>
                  <button
                    className="text-[#eca642] md:font-semibold"
                    onClick={() => switchForm("signin")}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </span>
          </div>
        </form>
      </div>
      {loading && (
        <div className="fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Auth;
