import React from 'react';
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {useNavigate } from "react-router-dom";
import { useStateAuth } from "../../context/Auth";


const SignOutModal = ({setModal}) => {
    const navigate = useNavigate();
    const { setSignOutModal,setAppUsers,
      setUserProfile,
      setAcctMenu,} = useStateAuth();


    const handleSignOut = async () => {
            setSignOutModal(false)
          try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
              isOnline: false,
            });
            await signOut(auth);
            setAppUsers(null);
            setUserProfile(null);
            setAcctMenu(null)
            navigate("/signin", { replace: true });
          } catch (err) {
            console.log(err);
          }
    
      };
  return (
    <div className = 'px-4 py-4 flex items-center justify-center'>
        <div>

            <p>Are you sure you want to Sign Out?</p>
            <div className='flex gap-4 justify-center mt-5'>
                <button className = 'border-[.2px] border-black px-2 py-1' onClick={handleSignOut}>Yes</button>
                <button className = 'bg-black text-white px-2 py-1' onClick={()=>setSignOutModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default SignOutModal