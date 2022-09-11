import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc
} from "firebase/firestore";
import { Link,useNavigate } from "react-router-dom";


import { auth, db,  } from "../lib/firebase";
import { useStateAuth } from "../context/Auth";
import User from "../components/usersList/User";


const Friends = () => {
  const { userProfile, setUserProfile, appUsers, setAppUsers,setChat } = useStateAuth();
  const user1 = auth.currentUser.uid
    const navigate = useNavigate()
  const [msgs, setMsgs] = useState([])




  const selectUser  = async (profile)=>{
    setChat(profile);
    navigate(`/chat/${profile.uid}`)
    
  };

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

  return (
    <div className="flex w-full body_screen px-4">
      <div className="w-full sm:border-r-[1px] flex-col gap-3 h-full sticky flex">{appUsers ? 
      <div>
        <div className='' >
      <div className='flex justify-center w-full '>
        <p className='text-lg font-semibold text-center'>Chats</p>
      </div>
      <div className='overflow-y-auto overflow-x-hidden'>
      <div className='w-full h-fulll'>

      {appUsers.map((user)=>(
        
        <button  onClick = {selectUser}><User key = {user.uid} profile= {user} selectedUser = {selectUser} user1 ={user1} isUserList smallView/></button>
      ))}
      </div>
      </div>
    </div>
      </div>
      : "Users not found"}</div>
      
    </div>
  );
};

export default Friends;
