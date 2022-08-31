import React, { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useStateAuth } from "../../context/Auth";
import { UilExclamationTriangle } from "@iconscout/react-unicons";
import { CircularProgress } from "@mui/material";

const AccountDeleteModal = ({ setModal }) => {
  const navigate = useNavigate();
  const {  setAppUsers, setUserProfile, setAcctMenu,userProfile, setDeleteAccountModal, setReauthModal } =
    useStateAuth();
const [loading, setLoading] = useState(false)

 const reauthenticateUser = ()=>{

 }
  const deleteAccount= async()=>{
    setLoading(true);
    const getAllUserDrops = await getDocs(query(collection(db,'drop'), where('authorId','==', userProfile.uid)))

    try {
        const batch = writeBatch(db);

            batch.delete(doc(db, 'users', userProfile.uid))
            batch.delete(doc(db, 'notification', userProfile.uid))
            batch.delete(doc(db, 'chatList', userProfile.uid))
            if (!getAllUserDrops.empty){getAllUserDrops.forEach(drop=>{
                batch.delete(doc(db, 'drop', drop.data().id))
            })}
            batch.delete(doc(db, 'lastMsg', userProfile.uid))

            batch.commit().then(()=>{
                deleteUser(auth.currentUser).then(()=>{
            
                }).catch((e)=>{
                    console.log(e)
                    setLoading(false)
                    setReauthModal(true)
                })
                setDeleteAccountModal(false);
                setReauthModal(false)
                setAppUsers(null);
                setUserProfile(null);
                setAcctMenu(null);
                navigate("/signin", { replace: true }); 
            })
            
       
        

    } catch (error) {
        console.log(error)

        setLoading(false)
    }
    
  }
  return (
    <div className="px-4 py-4 flex items-center justify-center">
    
      <div>
        <span className="mb-3 ">
          <p>
            Are you sure you want to{" "}
            <span className="font-semibold">Delete</span> this account?
          </p>
          <span className="text-red-500 flex gap-2">
            <UilExclamationTriangle />
            <p className="text-sm  max-w-[300px]">
              All data on this account would be lost
            </p>
          </span>
          <span className="text-red-500 flex gap-2 mt-1">
            <UilExclamationTriangle />
            <p className="text-sm  max-w-[300px]">
              Deleting this account would mean you won't be able to recover it
            </p>
          </span>
        </span>
        {loading ? <CircularProgress/> :<div className="flex gap-4 justify-center mt-5">
          <button
            className="border-[.2px] border-black px-2 py-1"
            onClick={deleteAccount}
          >
            Yes
          </button>
          <button
            className="bg-black text-white px-2 py-1"
            onClick={() => setDeleteAccountModal(false)}
          >
            Cancel
          </button>
        </div>}
      </div>
    </div>
  );
};

export default AccountDeleteModal;
