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
  writeBatch,
  arrayUnion,
  increment,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../lib/firebase";
import { useStateAuth } from "../context/Auth";
import UsersList from "../components/usersList/UsersList";
import User from "../components/usersList/User";
import MessageForm from "../components/chat/MessageForm";
import CloseIcon from "@mui/icons-material/Close";
import Message from "../components/chat/Message";
import { CircularProgress, dialogClasses } from "@mui/material";
import ChatArea from "../components/chat/ChatArea";
import { ArrowBackIos } from "@mui/icons-material";

const Messages = () => {
  const user1 = auth.currentUser.uid;
  const countRef = useRef(0)

  // states
  const {
    userProfile,
    setUserProfile,
    appUsers,
    setAppUsers,
    chat,
    setChat,
    chatList,
    setChatList,
    unreadMsgs,
    setUnreadMsgs,
    msgs, setMsgs
  } = useStateAuth();
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    pic: "",
    prevpic: "",
  });

  const navigate = useNavigate();
  const { pic, prevpic } = img;

  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleChangePhoto = (e) => {
    e.preventDefault();
    var binaryData = [];
    binaryData.push(e.target.files[0]);
    return setImg({
      ...img,
      [e.target.name]: e.target.files[0],
      [`prev` + e.target.name]: URL.createObjectURL(
        new Blob(binaryData, { type: "application/zip" })
      ),
    });
  };
  const handleSubmit = async (e) => {
    const batch = writeBatch(db)
    e.preventDefault();
    if (!text && !pic) return;
    const Text = text;
    const Pic = img.pic;
    setText("");
    setImg({
      pic: "",
      prevpic: "",
    });
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let url;

    if (Pic) {
      const imgRef = ref(storage, `images/${new Date().getTime()}-${Pic.name}`);
      const snap = await uploadBytes(imgRef, Pic);
      const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlurl;
    }
    addDoc(collection(db, "messages", id, "chat"), {
      text: Text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

  

    await runTransaction(db, async (transaction) => {

      const user1_chatList = await transaction.get(doc(db, "chatList", user1));
      const user2_chatList = await transaction.get(doc(db, "chatList", user2));

      transaction.set(doc(db, "lastMsg", id), {
        lastMsg: Text,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || "",
        unread: increment(1),
  
      }, {merge: true});

      

      let newUser2_chatList, newUser1_chatList;

      if (user2_chatList.exists()){
        newUser2_chatList = [user1,...(user2_chatList.data().chats.filter((user)=> user !== user1 )), ]
      }
      if(user1_chatList.exists()){
        newUser1_chatList = [ user2,...(user1_chatList.data().chats.filter((user)=> user !== user2 )), ]
      }
      transaction.set(doc(db, "chatList", user2), {
        chats: !user2_chatList.exists() ? [user1] : newUser2_chatList,
        unopen: true
      });
      transaction.set(doc(db, "chatList", user1), {
        chats: !user1_chatList.exists() ? [user2] : newUser1_chatList,
        
      });

      });
    
   


    
  };
  const showProfile = () => {
    navigate(`/profile/${chat.uid}`);
  };
  const selectUser = async (profile) => {
    setChat(profile);
    setChatList(false);
   
  };

  // GET CURRENT USER
  useEffect(() => {
    // GET USERS THAT ARE NOT CURRENT USER
    if (!userProfile) return()=>{}
    let unsub;
    const usersRef = doc(db, "chatList",userProfile.uid);

    // query parameters
    const q = query(usersRef);

    // execute query
    unsub = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.data()) {
        setAppUsers([])
        return;}

      const chats = querySnapshot.data().chats;

      // STRUCTURE THE CHATLIST 
      const chatsObj = {}
      chats.forEach(chat=>chatsObj[chat]= {});

      let splitChats= []
      const chatLength = chats.length;

      // AFTER RETRIEVING 
     
      const sortedChats = []


      // SPLITTING THE LISTS INTO 10s FOR QUERYING
      if (chatLength > 10){
          const chatSize = Math.floor(chatLength/10)
          const maxSize = chatSize +1
          let start=0
          for (let i = 0; i < maxSize; i++){
            splitChats[i] = chats.split(start,((10*(i+1))))
            start = 10*(i+1)
          }
      }

      // CHECK IF CHATLIST WAS SPLIT
      if(splitChats.length){
        splitChats.forEach((chatArray,)=>{
          const usersRef =collection(db, 'users')
          const q = query(usersRef, where("uid", "in", chatArray))
          getDocs(q).then((users)=>{
            const downloadedchats = []

            users.forEach((user, )=>{
              downloadedchats.push(user.data)
              countRef.current = countRef.current + 1
              if (countRef.current>= (splitChats[(splitChats.length)-1]).length){
                
                setAppUsers(downloadedchats);
                countRef.current = 0
              }
            })

            
          })
        })
    
      }else{
        const usersRef =collection(db, 'users')

          const q = query(usersRef, where("uid", "in", chats ))
          getDocs(q).then((users)=>{
            const downloadedchats = []
            users.forEach((user, )=>{
              downloadedchats.push(user.data())
              
              countRef.current = countRef.current + 1
              if (countRef.current >= chats.length ){
                downloadedchats.forEach(chat=>{
                  chatsObj[chat.uid] = chat
                })

                setAppUsers(Object.values(chatsObj))
                countRef.current = 0
              }
              
            })
            
          })
      }
      

      // let users = [];
      // querySnapshot.forEach((doc) => {
      //   users.push(doc.data());
      // });
      // setAppUsers(users);
    });

    return () => unsub();
  }, [userProfile]);

  useEffect(()=>{
    if(!unreadMsgs) return ()=>{}

    const docRef = doc(db, 'chatList', userProfile?.uid)
    updateDoc(docRef, {
      unopen: false
    }).then(()=>{
      setUnreadMsgs(false)
    })

  },[unreadMsgs])

  useEffect(() => {
    if (!userProfile) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
        if (docsnap.exists) {
          setUserProfile(docsnap.data());
        }
      });
    }
  }, []);

  useEffect(()=>{
    if (!chat) return()=>{}
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

   const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

  
    getDoc(doc(db, "lastMsg", id)).then((docSnap)=>{

      if (docSnap.data() && docSnap.data().from !== user1) {
        updateDoc(doc(db, "lastMsg", id), { unread: 0 });
      }
    })
  },[chat])

  // useEffect(() => {
  //   if (!msgs.length) {
  //     const user2 = chat.uid;
  //   const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
  //   const msgsRef = collection(db, "messages", id, "chat");
  //   const q = query(msgsRef, orderBy("createdAt", "asc"));

  //  getDocs(q, (querySnapshot) => {
  //     let msgs = [];
  //     querySnapshot.forEach((doc) => {
  //       msgs.push(doc.data());
  //     });
  //     setMsgs(msgs);
  //   });

  //   }
  // }, []);

  return (
    <div className="sm:flex  w-full body_screen  s500:h-[100vh]">
      <div
        className={`w-full s500:w-[40%]  md:w-[35%] sm:border-r-[1px] dark:border-none flex-col gap-3  dark:bg-slate-800 h-full  sm:top-0  sm:flex z-[30] ${
          chatList ? "sm:flex " : "sm:flex hidden"
        }`}
      >
        {appUsers ? (
          <UsersList
            users={appUsers}
            selectUser={selectUser}
            isUserList
            user1={user1}
          />
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className="  flex flex-col  h-full w-full s640:w-[60%]  md:w-[65%] ">
        {chat ? (
          <div className="h-full flex flex-col w-full">
            <nav className="shadow-sm p-2 h-fit flex items-center">
              <button
                className="sm:hidden mr-1 dark:text-white/90"
                onClick={() => setChatList(true)}
              >
                <ArrowBackIos />
              </button>
              <button onClick={showProfile}>
                <User profile={chat} />
              </button>
            </nav>

            <ChatArea msgs={msgs} user1={user1} />

            {/*message form  */}
            <div className="h-fit w-full flex flex-col items-center">
              {prevpic && (
                <div className="border-2 rounded-md p-2">
                  <button
                    className="float-right"
                    onClick={() => setImg({ pic: "", prevpic: "" })}
                  >
                    <CloseIcon />
                  </button>
                  <img
                    src={prevpic}
                    className="w-[200px] h-[200px] object-contain"
                    alt="prevpic"
                  />
                </div>
              )}
              <MessageForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                value={text}
                handleChangePhoto={handleChangePhoto}
              />
            </div>
          </div>
        ) : (
          <p className="w-full dark:text-white/90 h-full text-2xl font-medium text-center mt-10 md:mt-20">
            Select a user to start a conversation
          </p>
        )}
      </div>
    </div>
  );
};

export default Messages;
