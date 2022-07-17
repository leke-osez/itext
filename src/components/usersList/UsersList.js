import React from 'react'
import User from './User'

const UsersList = ({users, selectUser, user1}) => {
  return (
    <div className='' >
      <div className='flex justify-center w-full '>
        <p className='text-lg font-semibold text-center'>Chats</p>
      </div>
      <div className='overflow-y-auto overflow-x-hidden'>
      <div className='w-full '>

      {users.map((user)=>(

        <User key = {user.uid} profile= {user} selectedUser = {selectUser} user1 ={user1} isUserList/>
      ))}
      </div>
      </div>
    </div>
  )
}

export default UsersList