import React from 'react';
import { UilTear } from '@iconscout/react-unicons'

const DropButton = ({handleModal}) => {
  return (
    <div>
        <button className = 'px-9 py-2 text-white bg-textColor rounded-full hidden md:flex md:gap-1 md:items-center' onClick = {handleModal}>Drop<UilTear className = 'w-5 h-5'/></button>
        <button className = 'p-2 text-white bg-textColor rounded-full md:hidden' onClick = {handleModal}><UilTear/></button>

    </div>
  )
}

export default DropButton