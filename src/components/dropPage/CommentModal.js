import React, { useState } from 'react';
import { useStateAuth } from '../../context/Auth';
import CommentBox from './CommentBox';
import DropOwner from './DropOwner';
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
import {  db } from "../../lib/firebase";

const CommentModal = () => {
    const {activeDrop, drops,setDrops, userProfile, setCommentModal} = useStateAuth();
    const [dropText, setDropText] = useState('');
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState(null)
    const handleChangeText = (e)=>{
        setDropText(e.target.value)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!dropText.trim()) return;
        setLoading(true)
        const commentData = {
          commentText:dropText,
          author: userProfile?.uid,
          createdAt: Timestamp.fromDate(new Date()),
          likes:[]
        }
        try {
        const batch = writeBatch(db)
          addDoc(collection(db, 'comments', activeDrop.id, 'comment'),commentData)
          batch.update(doc(db, "drop", activeDrop.id ),{comments: increment(1)});
          await batch.commit();

          setDrops(drops.map((dropItem)=>{
            if (dropItem.id === activeDrop?.id){
              return{...dropItem, comments: dropItem.comments+1}
            }
            return dropItem
          }))
            setDropText('')
            setLoading(false)
            setCommentModal(false)

        } catch (error) {
          console.log(error)
        }
        
      }
  return (
    <div className='p-3'>
        <DropOwner drop={activeDrop} />
        <CommentBox user = {userProfile} onChangeText = {handleChangeText} dropText = {dropText} handleSubmit = {handleSubmit} loading = {loading}/>
        
    </div>
  )
}

export default CommentModal