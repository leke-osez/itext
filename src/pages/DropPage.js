import React, { useEffect, useState } from 'react'
import CommentBox from '../components/dropPage/CommentBox';
import CommentList from '../components/dropPage/CommentList';
import DropOwner from '../components/dropPage/DropOwner';
import { useStateAuth } from '../context/Auth';
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
  limit,
  writeBatch,
  increment
} from "firebase/firestore";

import {  db } from "../lib/firebase";
import { useParams } from 'react-router-dom';




const DropPage = ({dropPage}) => {
  const {activeDrop, userProfile, drops, setDrops} = useStateAuth();
  const [dropText, setDropText] = useState('');
  const [comments, setComments] = useState(null)
  const params = useParams()

  const dropId = params.id;

  const handleChangeText = e=>{
    setDropText(e.target.value)
  }

  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!dropText.trim()) return;
    const commentData = {
      commentText:dropText,
      author: userProfile?.uid,
      createdAt: Timestamp.fromDate(new Date()),
      likes:[]
    }
    try {
      const batch = writeBatch(db)
          batch.set(collection(db, 'comments', activeDrop.id, 'comment'),commentData)
          batch.update(doc(db, "drop", activeDrop.id ),{comments: increment(1)});
          await batch.commit();
      
      setComments([{...commentData, avatar:userProfile?.avatar, name: userProfile?.name},...comments])
      setDropText('')
    } catch (error) {
      console.log(error)
    }

  }

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

    const msgsRef = collection(db, 'comments', dropId, 'comment');
    const getComments = async () => {
        try {
          const commentList = []

          const q = query(msgsRef,orderBy('createdAt', 'desc'))
          const docs = await getDocs(q);
          docs.forEach((doc) => {
              commentList.push({...doc.data(),id:doc.id})
              console.log(doc.data().authorDetails)
          });
          setComments(commentList)

        } catch (error) {
          console.log(error);
        }

      };
  
      return () => {
      getComments()
    };
  }, []);
  return (
    <div className='p-3'>
        <DropOwner drop={activeDrop} likeDrop = {likeDrop}/>
        <CommentBox user = {userProfile} onChangeText = {handleChangeText} dropText = {dropText} handleSubmit = {handleSubmit}/>
        {comments && <CommentList comments = {comments}/>}
    </div>
  )
}

export default DropPage