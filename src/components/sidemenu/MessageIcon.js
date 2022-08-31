import React from 'react'
import { useStateAuth } from '../../context/Auth';
import {UilMessage} from "@iconscout/react-unicons";

const MessageIcon = ()=>{
    const {unreadMsgs} = useStateAuth()
    return(
      <div className="relative">
{    unreadMsgs &&    <div className="h-[.4rem] aspect-square rounded-full bg-blue-500 p-0 absolute -top-0 -right-0"></div>
}        <div className='text-black/60 dark:text-white/90'> <UilMessage/>
      </div></div>
    )
  }

export default MessageIcon