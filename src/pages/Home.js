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
  const { userProfile, setUserProfile,  setAppUsers,} = useStateAuth();
  const navigate = useNavigate()

  useEffect(() => {

    let unsub;
    const usersRef = collection(db, "users");

    // query parameters
    const q = query(usersRef, where("uid", "not-in", [user1]));

    // execute query
    unsub = onSnapshot(q, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setAppUsers(users);
      });
      
    return () => unsub();
  }, []);


  useEffect(() => {
    if(!userProfile){getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
      if (docsnap.exists) {
        setUserProfile(docsnap.data());
      }
    });}
  }, []);

  
  return(
    <div className="">
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
