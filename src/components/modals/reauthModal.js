import React, { useState,  } from "react";
import {
  reauthenticateWithCredential as reauth
} from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import { auth, db } from "../../lib/firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import logo from "../../assets/img/logo3.png";
import { useStateAuth } from "../../context/Auth";

const ReauthModal = ({ signUp }) => {
    const {setReauthModal} = useStateAuth()
  const initialState = {
    email: "",
    password: "",
    loading: false,
    error: false,
  };
  const [data, setData] = useState(initialState);
 
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  
  const handleReauth = async()=>{
    reauth(auth.currentUser, email, password).then(()=>{
        setReauthModal(false)
    }).catch((error)=>console.log(error))
  }
  
  // destructuring object -- data
  const {  email, password, error, loading } = data;

  return (
    <div
      className={`w-full  flex flex-col-reverse md:flex-row justify-center items-center ${
        loading ? "bg-black/5" : ""
      }`}
    >

      {/* Authentication form */}
      <div className="w-[45%] p-0 h-full ">
        <form
          className="w-full flex justify-center items-center md:mt-10"
          
        >
          <div className="flex flex-col items-center gap-2 md:gap-3 h-fit min-w-[250px] w-full md:w-[90%] rounded-lg md:px-2  py-3 md:p-3 bg-inherit auth_form">
            {/* App Logo */}
            <div>
              <img src={logo} alt="app-logo" className="w-[5rem] h-[5rem]" />
            </div>

            <h2 className="text-lg  text-red font-normal mb-3 md:mb-10 text-center md:text-[1.7rem]">
              Please re-signin to complete this action
            </h2>

            <div className="flex flex-col items-center gap-3 md:gap-5 mb-7 text-start w-full">

              <div className="flex flex-col w-[100%] ">
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
                  className="email text-black w-full rounded-full h-[2.7rem] bg-white max-w-[400px] border-[.17rem] xl:border-[.3rem] border-[#eca642]/70 px-5"
                  type="email"
                  onChange={handleChange}
                  value={email}
                  
                />
              </div>

              <div className="flex flex-col w-[100%] ">
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
                  className="password w-full text-black rounded-full h-[2.7rem] max-w-[500px] border-[.17rem] xl:border-[.3rem]  border-[#eca642]/70 px-5"
                  type="password"
                  onChange={handleChange}
                  value={password}
                />
              </div>
            </div>
            {error && <p className="text-red-700">{error}</p>}
       
            <button
              onSubmit={handleReauth}
              disabled={loading}
              className="bg-[#fca120] text-[1.2rem] w-full py-2 font-bold text-white rounded-[.5rem] max-w-[200px]"
            >
              Re-login
            </button>
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

export default ReauthModal;
