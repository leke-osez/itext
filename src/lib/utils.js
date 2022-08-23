import {  db, } from "../lib/firebase";
import React from 'react';
import { getDoc, doc, updateDoc , setDoc, writeBatch} from "firebase/firestore";

export const handleFollow = async(id, userProfile, setAction=()=>{})=>{

    const batch = writeBatch(db) 
    const userId = userProfile?.uid;

    const userToFollowRef = doc(db, 'users', id);
    const userRef = doc(db, 'users', userId);

    const userToFollow = await getDoc(userToFollowRef);
    const userToFollowFollowers = userToFollow.data().followers

    const following = userProfile?.following;

    const userIndex = following.findIndex(follow=>follow === id);
    const userToFollowFollowersIndex = userToFollowFollowers.findIndex(follow=>follow === userId);


    if (userIndex === -1){
      following.push(id);
      userToFollowFollowers.push(userId);

      batch.update(userRef,{
        following
      });
      batch.update(userToFollowRef,{
        followers: userToFollowFollowers 
      });

    } else{
      following.splice(userIndex,1);
      userToFollowFollowers.splice(userToFollowFollowersIndex, 1)

      batch.update(userRef,{
        following
      });
      batch.update(userToFollowRef,{
        followers: userToFollowFollowers 
      });
    }

    await batch.commit();
    setAction(id)
  };