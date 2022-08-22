import { Avatar, CircularProgress, TextareaAutosize } from '@mui/material'
import React from 'react'

const CommentBox = ({user, onChangeText, dropText, handleSubmit, loading}) => {
    const handleChangeText = (e)=>{
        onChangeText(e)
    }
  return (
    <div className = 'flex gap-5 items-center'>
        <Avatar src={user?.avatar}/>
        <TextareaAutosize
            minRows={1}
            className="h-3 p-4 sm:w-[100%] min-w-[250px] max-w-[400px]"
            placeholder="Write comment..."
            onChange={handleChangeText}
            value={dropText}
          />
{  loading ? <CircularProgress/> :<button onClick = {handleSubmit} className = 'bg-textColor text-white text-base font-medium px-2 py-1 rounded-full'>Reply</button>}    </div>
  )
}

export default CommentBox