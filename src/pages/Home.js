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
import { auth, db, storage } from "../lib/firebase";
import { useStateAuth } from "../context/Auth";
import UsersList from "../components/usersList/UsersList";
import User from "../components/usersList/User";
import MessageForm from "../components/MessageForm";
import CloseIcon from '@mui/icons-material/Close';
import Message from "../components/Message";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const { userProfile, setUserProfile, appUsers, setAppUsers,chat, setChat } = useStateAuth();
  const user1 = auth.currentUser.uid
  const [text, setText] = useState('')
  const [img, setImg] = useState({
    pic:'',
    prevpic: ''
  })
  const [msgs, setMsgs] = useState([])

  const {pic, prevpic} = img

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

  const selectUser  = async (profile)=>{
    setChat(profile);

    const user2 = profile.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgsRef = collection(db, 'messages', id, 'chat');

    const q = query(msgsRef,orderBy('createdAt', 'asc'))

    onSnapshot(q, querySnapshot =>{
      let msgs = []
      querySnapshot.forEach(doc =>{
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })

   const docSnap = await getDoc(doc(db,'lastMsg', id))
   if(docSnap.data() && docSnap.data().from !== user1){
    await updateDoc(doc(db, 'lastMsg', id), {unread: false})
   }
  };

  console.log(msgs)
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
    <div className="sm:flex body_screen ">
      <div className="sm:w-[35%] md:w-[27%] w-full sm:border-r-[1px] flex-col gap-3 bg-white sm:bg-slate-800/10 h-full md:sticky absolute sm:flex z-[40]">{appUsers ? <UsersList users={appUsers} selectUser = {selectUser} isUserList user1 ={user1}/> : <CircularProgress/>}</div>
      <div className="relative  flex-1 h-full ">
        {
          chat ? (
            <div className="h-full flex flex-col ">
              <nav className="shadow-sm p-2 h-fit ">
                <User profile={chat}/>
              </nav>

              {/* chat bubbles here */}
              <div className="flex-1  w-full overflow-auto border-b-2 px-3 py-2 md:px-7 ">
                {
                  msgs.length ? msgs.map((msg, i)=>(
                    
                    <Message key = {i} msg ={msg} user1 = {user1}/>)
                  ): ''
                }
              </div>

              {/*message form  */}
              <div className="h-fit w-full flex flex-col items-center">
                {prevpic && <div className="border-2 rounded-md p-2">
                  <button className="float-right" onClick={()=>setImg({pic:'', prevpic:''})}><CloseIcon/></button>
                  <img src= {prevpic} className = 'w-[200px] h-[200px] object-contain' alt='prevpic'/></div>}
                <MessageForm handleSubmit={handleSubmit} handleChange = {handleChange} value ={text} handleChangePhoto = {handleChangePhoto} /></div>
            </div>
          ):(
            <p className="w-full h-full text-3xl font-semibold text-center mt-10">Select a user to start a conversation</p>
          )
        }
      </div>
    </div>
  );
};

export default Home;
