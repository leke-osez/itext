import { TextareaAutosize } from '@mui/material'
import React, { useState } from 'react';
import { CameraAlt } from '@mui/icons-material';
import {

  UilMessage,

} from "@iconscout/react-unicons";

const MessageForm = ({handleSubmit, handleChange, value, handleChangePhoto}) => {
    const [img, setImg] = useState({
        pic:'',
        prevpic: ''
      })

    const handleSend = (e)=>{
        handleSubmit(e)

    }
   

  return (
    <form onSubmit={handleSend}>

    <div className='flex gap-2 items-end  w-full md:w-[500px]'>
            <label htmlFor='messagePic'><CameraAlt className = 'upload_image dark:text-white/90' /></label>
            <input
                style={{display: 'none'}}
                type = 'file'
                onChange = {handleChangePhoto}
                accept = "image/*"
                id = 'messagePic'
                name = 'pic'
            />
        <div className='md:w-[400px] sm:w-[300px] max-w-[300px] flex-1 flex'>

        <TextareaAutosize
            minRows={2}
            style = {{width:'100%', borderWidth: 2,minHeight:10, borderColor: 'black', borderRadius: 10, padding:4, minWidth:150}}
            placeholder = 'Reply...'
            onChange={handleChange}
            value = {value}
        />
        </div>
        <button className='bg-green-400 text-white rounded-md sm:px-3 sm:py-2 px-1 py-1 text-base' onClick={handleSend}><UilMessage/></button>
    </div>
    </form>

  )
}

export default MessageForm