import React, { useEffect, useRef } from 'react';
import Moment from 'react-moment'

const Message = ({msg,user1,onLoad}) => {
  
  return (
    <div className={`mt-[5px] inline-block w-full  `} >
        <div className={`max-w-[70%] min-w-[50%]  rounded-xl  ${msg.from === user1 ? 'float-right bg-orange-300/70' : 'float-left bg-gray-300/70'}`} >
            <p className='px-2'>{msg.from === user1 ? 'You': ''}</p>
            {
                msg.media ? <img src = {msg.media} alt = {msg.text} className = 'w-full ' onLoad={onLoad}/>: null
            }
            <div className='px-3 py-1'>
            <p className='text-base text-black/80 text-wrap'>{msg.text}</p>
            <small className=' text-black/70 text-xs'><Moment fromNow >{msg.createdAt.toDate()}</Moment></small>
            </div>
        </div>
    </div>
  )
}

export default Message