import React, { useCallback, useEffect, useRef, useState } from 'react';
import { after } from 'underscore';
import Message from './Message';

const ChatArea = ({msgs,user1}) => {
    const scrollRef = useRef();

    // filter msgs with media
    const imgUrls = []
    msgs.forEach(e =>  msgs?.media ? imgUrls.push(msgs.media) :null
    );

    // when all media has been loaded
    const onLoadImages = useCallback(after(imgUrls.length,()=>{
            scrollRef?.current?.scrollIntoView({behavior:"smooth", block: "end", inline: "end"})
        }
    ),[msgs]);

    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior:"smooth", block: "end", inline: "end"})

    },[msgs])



  return (
    <div className="flex-1  w-full overflow-auto border-b-2 px-3 py-2 xl:px-7 ">
    
    {
      msgs?.map((msg, i)=>(
        
        <Message key = {i} msg ={msg} user1 = {user1} onLoad = {onLoadImages}/>)
      )
    }
    <div ref= {scrollRef}>{''}</div>
  </div>
  )
}

export default ChatArea