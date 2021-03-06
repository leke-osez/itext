import React, { useEffect, useRef } from 'react';
import Moment from 'react-moment'

const Message = ({msg,user1}) => {
  const scrollRef = useRef();
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[msg])
  return (
    <div className={`mt-[5px] inline-block w-full  `}>
        <div className={`max-w-[50%] w-fit  rounded-xl  ${msg.from === user1 ? 'float-right bg-orange-300/70' : 'float-left bg-gray-300/70'}`} ref= {scrollRef}>
            <p className='px-2'>{msg.from === user1 ? 'You': ''}</p>
            {
                msg.media ? <img src = {msg.media} alt = {msg.text} className = 'w-full '/>: null
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