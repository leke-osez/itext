import React, { useState, useEffect, useRef } from "react";
import { useStateAuth } from "../context/Auth";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  updateDoc,
  limit,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import DropsList from "../components/drops/DropsList";
import { CircularProgress } from "@mui/material";

const Drops = () => {
  const { drops, setDrops } = useStateAuth();
  const countRef = useRef(0)
  const likeDrop  = async(drop)=>{
    const dropLikes = ()=>{
      const dropIndex = drops.findIndex(dropItem=>dropItem.id === drop.id)
      const dropItem = drops[dropIndex]
      const isLiked = dropItem.likes.findIndex(like => like === drop.likeId)
       // NOT LIKED
       if (isLiked === -1){
        return [drop.likeId,...dropItem.likes]
      }
      return dropItem.likes.filter(like=> like !== drop.likeId)
    }

    // DATABASE UPDATE
    try {
      const docRef = doc(db, "drop", drop.id )
      await updateDoc(docRef, {
        likes: dropLikes()
    });

    // UI UPDATE
      setDrops(drops.map((dropItem)=>{
        if (dropItem.id === drop?.id){
          return{...dropItem, likes: dropLikes()}
        }
        return dropItem
      }))
    } catch (error) {
      console.log(error)
    }
  }

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
    
  }, []);
  
  return (
    <div className="flex flex-col gap-2 p-3">
      {drops ? <DropsList drops = {drops} likeDrop = {likeDrop}/> : <CircularProgress/>}
    </div>
  );
};

export default Drops;
