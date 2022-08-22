import { TextareaAutosize } from '@mui/material'
import React, { useState } from 'react';
import { CameraAlt } from '@mui/icons-material';

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

    <div className='flex gap-2 items-end  md:w-[500px]'>
            <label htmlFor='messagePic'><CameraAlt className = 'upload_image' /></label>
            <input
                style={{display: 'none'}}
                type = 'file'
                onChange = {handleChangePhoto}
                accept = "image/*"
                id = 'messagePic'
                name = 'pic'
            />
        <div className='md:w-[400px] sm:w-[300px] w-[220px]'>

        <TextareaAutosize
            minRows={2}
            style = {{width:'100%', borderWidth: 2,minHeight:10, borderColor: 'black', borderRadius: 10, padding:4}}
            placeholder = 'Reply...'
            onChange={handleChange}
            value = {value}
        />
        </div>
        <button className='bg-green-400 text-white rounded-md px-3 py-2' onClick={handleSend}>Send</button>
    </div>
    </form>

  )
}

export default MessageForm