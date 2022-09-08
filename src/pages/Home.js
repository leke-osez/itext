import React, { useEffect, useRef, useState } from "react";
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
  updateDoc,
  getDocs,
  limit
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
  const { userProfile, setUserProfile, dropTracker} = useStateAuth();
  const countRef = useRef(0)
  const navigate = useNavigate()
  const { drops, setDrops } = useStateAuth();

  useEffect(() => {
    if(!userProfile){getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
      if (docsnap.exists) {
        setUserProfile(docsnap.data());
      }
    });}
  }, []);

  useEffect(() => {
    const getDrops = async () => {
    const drops = {}
      try {
        
        const q = query(collection(db, "drop"),orderBy('createdAt','desc'), limit(20))
        const docs = await getDocs(q);
        docs.forEach((document) => {
            const data = document.data();
            drops[document.id] = {...data,id:document.id};
            const authorRef = doc(db, "users", data.authorId)
            getDoc(authorRef).then((userDoc)=>{
                const authorData = userDoc.data()
                drops[document.id].name = authorData.name;
                drops[document.id].avatar = authorData.avatar;
                countRef.current = countRef.current + 1
                if (countRef.current === dropsArray.length){
                  setDrops(dropsArray)

                }
            })
    
        });

        var dropsArray = Object.values(drops) 
      } catch (error) {
        console.log(error);
      }
    };

    
     getDrops();
    
  }, [dropTracker]);
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
