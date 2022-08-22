import { Avatar } from '@mui/material'
import React from 'react'

const AvatarContainer = ({user, isText, }) => {
  return (
    <div className='flex gap-3'>
        <Avatar src = {user?.avatar}  className='avatar'/>
        {isText ? <p className='text-black/70 text-base '>{user?.name}</p> : ''}
    </div>
  )
}

export default AvatarContainer