import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {useNavigate} from 'react-router-dom'
import { auth, db, storage } from "../lib/firebase";
import { useStateAuth } from "../context/Auth";
import UsersList from "../components/usersList/UsersList";
import User from "../components/usersList/User";
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from "@mui/material";
import DropsBox from "../components/dropsBox/DropsBox";
import DropsList from "../components/drops/DropsList";
import Drops from "./Drops";

const Home = () => {
  const user1 = auth.currentUser.uid;

  // states
  const { userProfile, setUserProfile, } = useStateAuth();
  const navigate = useNavigate()

 


  useEffect(() => {
    if(!userProfile){getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
      if (docsnap.exists) {
        setUserProfile(docsnap.data());
      }
    });}
  }, []);

  
  return(
    <div className="dark:slate-900">
      <div className=" flex flex-col ">
        <div className = 'mb-[4rem]'>
          <DropsBox user = {userProfile} />
        </div>
        <Drops/>

      </div>
    </div>
  )
};

export default Home;
