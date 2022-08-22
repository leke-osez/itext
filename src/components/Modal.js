import React from 'react';
import {UilTimes} from "@iconscout/react-unicons";
import { useStateAuth } from '../context/Auth';


const Modal = ({children, handleClick, }) => {
  const {setDropModal, setSignOutModal, setCommentModal} = useStateAuth()
  const handleModal = ()=>{
    setDropModal(false); 
    setSignOutModal(false);
    setCommentModal(false);
  };
  return (
    <div className='fixed top-0 left-0 h-screen right-0 z-[100] bg-black/30' onClick={handleModal}>
        <div className=' w-fit h-fit relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white px-3 py-2' onClick={(e)=> e.stopPropagation()}>
        <button onClick={handleModal} className = 'mb-3'><UilTimes/></button>
          {children}
        </div>
    </div>
  )
}

export default Modal