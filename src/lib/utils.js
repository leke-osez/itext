import { db, auth } from "../lib/firebase";
import React from "react";
import {
  getDoc,
  doc,
  updateDoc,
  setDoc,
  writeBatch,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {useNavigate } from "react-router-dom";

export const handleFollow = async (id, userProfile, setAction = () => {}) => {
  const batch = writeBatch(db);
  const userId = userProfile?.uid;

  const userToFollowRef = doc(db, "users", id);
  const userRef = doc(db, "users", userId);

  const userToFollow = await getDoc(userToFollowRef);
  const userToFollowFollowers = userToFollow.data().followers;

  const following = userProfile?.following;

  const userIndex = following.findIndex((follow) => follow === id);
  const userToFollowFollowersIndex = userToFollowFollowers.findIndex(
    (follow) => follow === userId
  );

  if (userIndex === -1) {
    following.push(id);
    userToFollowFollowers.push(userId);

    batch.update(userRef, {
      following,
    });
    batch.update(userToFollowRef, {
      followers: userToFollowFollowers,
    });
  } else {
    following.splice(userIndex, 1);
    userToFollowFollowers.splice(userToFollowFollowersIndex, 1);

    batch.update(userRef, {
      following,
    });
    batch.update(userToFollowRef, {
      followers: userToFollowFollowers,
    });
  }

  await batch.commit();
  setAction(id);
};

export const getDrops = async (countRef, setDrops, q, location, profContents) => {
  const drops = {};
  try {
    // const q = query(collection(db, "drop"),orderBy('createdAt','desc'), limit(20))
    const docs = await getDocs(q);
    
    let tracker = 0;
    if(docs.empty){
      setDrops({[location ? location : 'drops']: []});

    }
    docs.forEach((document) => {
     
      // if (tracker === 0 && !document.data()){

      // }
      const data = document.data();
      drops[document.id] = { ...data, id: document.id };
      const authorRef = doc(db, "users", data.authorId);
      getDoc(authorRef).then((userDoc) => {
        const authorData = userDoc.data();
        drops[document.id].name = authorData.name;
        drops[document.id].avatar = authorData.avatar;
        
        countRef.current = countRef.current + 1;
       
        if (countRef.current === dropsArray.length) {    

          setDrops({[location ? location : 'drops']: dropsArray.length ? dropsArray : []});
          countRef.current = 0;
        }
      });
    });
    
    // SORT LIKES DROPS 
    var dropsArray = location === 'likes' ? Object.values(drops).reverse() : Object.values(drops);

  } catch (error) {
    console.log(error);
  }
};

export const handleLikeDrop  = (drops, setDrops)=>{

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
     setDrops(drops,drop);
     drops.map((dropItem)=>{
      if (dropItem.id === drop?.id){
        return{...dropItem, likes: dropLikes()}
      }
      return dropItem
    })
   } catch (error) {
     console.log(error)
   }
 }

 return likeDrop
}

export const getNotifications = async(id, handleDoc, )=>{

  const notificationRef = doc(db, "chatList", id);
  const unsub = onSnapshot(notificationRef, (doc) => {
    if (!doc.exists()) return
    const msgNotification = doc.data()
    handleDoc(msgNotification.unopen)
    })
  unsub()

}

export const deleteDropFromDB = async (id)=>{
  const docRef = doc(db, 'drop', id)
  await deleteDoc(docRef)
} 

