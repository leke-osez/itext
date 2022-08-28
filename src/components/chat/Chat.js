import React, { useEffect, useState } from "react";
import { useParams,  } from 'react-router-dom';
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
import { auth, db, storage } from "../../lib/firebase";
import { useStateAuth } from "../../context/Auth";
import User from "../usersList/User";
import MessageForm from "./MessageForm";
import CloseIcon from '@mui/icons-material/Close';
import Message from "./Message";

const Chat = () => {

    let { messageid } = useParams();
    const { chat, } = useStateAuth();
    const user1 = auth.currentUser.uid
    const [text, setText] = useState('')
    const [msgs, setMsgs] = useState([])

    const [img, setImg] = useState({
      pic:'',
      prevpic: ''
    })
    const {pic, prevpic} = img;

    const handleChange =(e)=>{
      setText(e.target.value)
    }
    const handleChangePhoto = (e)=>{
      e.preventDefault()
      var binaryData = [];
              binaryData.push(e.target.files[0]);
              return setImg({
                  ...img, 
                  [e.target.name]: e.target.files[0],
                  [`prev` + e.target.name]: URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
              })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!text) return
        const user2 = chat.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let url ;
    
        if (img.pic){
          const imgRef = ref(storage, `images/${new Date().getTime()}-${pic.name}`)
          const snap = await uploadBytes(imgRef, pic)
          const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
          url = dlurl
        }
        await addDoc(collection(db, 'messages',id, 'chat'),{
          text,
          from: user1,
          to: user2,
          createdAt: Timestamp.fromDate(new Date()),
          media: url || ''
        })
    
        await setDoc(doc(db,"lastMsg", id),{
          lastMsg: text,
          from: user1,
          to: user2,
          createdAt: Timestamp.fromDate(new Date()),
          media: url || '',
          unread: true
        })
    
        setText('')
        setImg({
          pic:'',
          prevpic:''
        })
      }
useEffect(()=>{
    const user2 = messageid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const msgsRef = collection(db, 'messages', id, 'chat');
    
        const q = query(msgsRef,orderBy('createdAt', 'asc'))
    
       let unsub = onSnapshot(q, querySnapshot =>{
          let msgs = []
          querySnapshot.forEach(doc =>{
            msgs.push(doc.data())
          })
          setMsgs(msgs)
        })
        const loadMssg  = async ()=>{
       const docSnap = await getDoc(doc(db,'lastMsg', id))
       if(docSnap.data() && docSnap.data().from !== user1){
        await updateDoc(doc(db, 'lastMsg', id), {unread: false})
       }
      };
    loadMssg()

    return ()=> unsub()
    
    
},[])
  return (
    <div className="relative  flex-1 h-full ">
        
            <div className="h-full flex flex-col ">
              {/* <nav className="shadow-sm p-2 h-fit ">
                <User profile={chat}/>
              </nav> */}

              {/* chat bubbles here */}
              {msgs.length ?<div className="flex-1 w-full overflow-auto border-b-2 px-3 py-2 md:px-7 ">
                
                  { msgs.map((msg, i)=>(
                    
                    <Message key = {i} msg ={msg} user1 = {user1}/>)
                  )}
                
              </div>:
              <div className=" w-full">
                
                </div>}

              {/*message form  */}
              <div className="h-fit w-full flex flex-col items-center">
                {prevpic && <div className="border-2 rounded-md p-2">
                  <button className="float-right" onClick={()=>setImg({pic:'', prevpic:''})}><CloseIcon/></button>
                  <img src= {prevpic} className = 'w-[200px] h-[200px] object-contain' alt='prevpic'/></div>}
                <MessageForm handleSubmit={handleSubmit} handleChange = {handleChange} value ={text} handleChangePhoto = {handleChangePhoto} /></div>
            </div>
          
        
      </div>
  )
}

export default Chat