import React from 'react'
import Comment from './Comment'

const CommentList = ({comments, likeComment}) => {
  return (
    <div className='flex flex-col mt-10 w-full'>
        {!comments.length ? <h3 className='w-full flex items-center justify-center py-10 text-xl text-black/60'>No comments yet...</h3>:
        comments.map((comment)=>(
            <Comment comment = {comment} key = {comment.id} likeComment = {likeComment}/>
        ))}
    </div>
  )
}

export default CommentList