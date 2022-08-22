import React from 'react'
import Comment from './Comment'

const CommentList = ({comments}) => {
  return (
    <div className='flex flex-col gap-3 mt-10 w-full'>
        {!comments.length ? <h3 className='w-full flex items-center justify-center py-10 text-xl text-black/60'>No comments yet...</h3>:
        comments.map((comment)=>(
            <Comment comment = {comment} key = {comment.id} />
        ))}
    </div>
  )
}

export default CommentList