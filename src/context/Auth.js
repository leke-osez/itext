import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut, deleteUser  } from "firebase/auth";
import Loading from "../components/Loading";
import { doc, getDoc, limit, query, updateDoc } from "firebase/firestore";
import {collection, getDocs, where} from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // AUTHENTICATION AND USERS
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [appUsers, setAppUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: userProfile?.name,
    bio: userProfile?.bio,
  });
  const [profileContents,setProfileContents] = useState({drops:null, likes: null, media:null})


  // CHAT STATES
  const [chat, setChat ]= useState(null);
  const [chatList, setChatList] = useState(true);

  // MESSAGES 
  const [messages, setMessages] = useState({})
  const [msgs, setMsgs] = useState([]);
  const [unreadMsgs, setUnreadMsgs] = useState(false)
  
  // MODAL STATES
  const [dropModal, setDropModal] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [editModal, setEditModal] = useState(false)
  
  // NAVIGATION MENU
  const [navMenu, setNavMenu] = useState(false)

  // ACCOUNT MENU
  const [acctMenu, setAcctMenu] = useState(false);


  //DROPS
  const [drops, setDrops] = useState(null);
  const [activeDrop, setActiveDrop] = useState(null)
  const [dropMenuOpen, setDropMenuOpen] = useState(false)
  const [dropTracker, setDropTracker] = useState(false)


  // USER RECOMMENDATIONS
  const [userRecommendations, setUserRecommendations] = useState([]);

  const checkThemeMode = ()=>{
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
      return 'dark'
    } else{
      return 'light'
    }
  }

  const [themeMode, setThemeMode]  = useState( checkThemeMode());

  const [accountDeleteModal, setDeleteAccountModal] = useState(false)

  const [reauthModal, setReauthModal] = useState(false)


  const value = {
    user, setUser, 
    userProfile, setUserProfile,
    appUsers, setAppUsers,
    chat, setChat,
    chatList, setChatList,
    dropModal, setDropModal,
    acctMenu, setAcctMenu,
    signOutModal, setSignOutModal,
    drops, setDrops,
    activeDrop, setActiveDrop,
    userRecommendations, setUserRecommendations,
    commentModal, setCommentModal,
    editModal, setEditModal,
    profile, setProfile,
    profileContents, setProfileContents,
    unreadMsgs, setUnreadMsgs,
    msgs, setMsgs,
    navMenu, setNavMenu,
    setDropMenuOpen, dropMenuOpen,
    themeMode, setThemeMode,
    accountDeleteModal, setDeleteAccountModal,
    reauthModal, setReauthModal,
    dropTracker, setDropTracker
  };

  // HANDLE AUTHENTICATION
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  // HANDLE USER PROFILE
  useEffect(() => {
    if(!userProfile && auth?.currentUser?.uid){getDoc(doc(db, "users",auth.currentUser.uid )).then((docsnap) => {
      if (docsnap.exists()) {
        setUserProfile(docsnap.data());
      }
    });}
  }, [auth?.currentUser?.uid]);

  useEffect(()=>{
    window.addEventListener("unload",(event)=>{return signOut(event)});

    return () => {
      window.removeEventListener('unload', (event)=>{return logout(event)})

    }

  })

    // GET USER RECOMMENDATIONS
  useEffect(() => {

    const getRecommendations = async()=>{
    try{
        const recommendations = []
        const q = query(collection(db, 'users'), where("uid", "!=", `${auth?.currentUser?.uid}`), limit(10))
        const userRec = await getDocs(q)

        userRec.forEach(user=>{
          const userData = user.data()
          const checkIfUserIsFollowing = userData.followers.findIndex(follower => follower === auth.currentUser.uid)
          
          if (checkIfUserIsFollowing === -1){
            recommendations.push(user.data())
          }
        })
        setUserRecommendations(recommendations)
      }
    
    catch(error){

      console.log(error)
    }
  }  
    return () => {
      getRecommendations()
    };
  }, [user]);


  // LISTEN FOR THEME CHANGES
  useEffect(()=>{
    if (themeMode === 'dark'){
      document.documentElement.classList.add('dark')
    }else{
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode])
  const logout = (ev) => {  
    ev.preventDefault();
      
        try {
          updateDoc(doc(db, "users", auth.currentUser.uid), {
            isOnline: false,
          });
          setAppUsers(null);
          setProfile(null);
          setAcctMenu(null)
          
        } catch (err) {
          console.log(err);
        }
      
     
}
  if (loading) {
    return <Loading />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useStateAuth = () => useContext(AuthContext);
