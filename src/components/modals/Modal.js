import React from 'react';
import {UilTimes} from "@iconscout/react-unicons";
import { useStateAuth } from '../../context/Auth';


const Modal = ({children, handleClick, disableCancel, reauth}) => {
  const {setDropModal,  setCommentModal, setEditModal, setReauthModal } = useStateAuth()
  const handleModal = ()=>{
    setDropModal(false); 
    setReauthModal(false)
    setCommentModal(false);
    setEditModal(false);


  };
  return (
    <div className={`fixed top-0 left-0 dark:text-white h-screen right-0 ${reauth ? 'z-[120]': 'z-[100]'} bg-black/40 dark:bg-black/70`} onClick={handleModal}>
        <div className='dark:bg-slate-900  w-full sm:w-fit h-fit relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white sm:px-3 py-2' onClick={(e)=> e.stopPropagation()}>
        {!disableCancel && <button onClick={handleModal} className = 'mb-3'><UilTimes className = 'dark:text-white/90'/></button>}
          {children}
        </div>
    </div>
  )
}

export default Modal