import React from 'react'
import { Link } from 'react-router-dom'

const MenuContent = ({text,Icon,path}) => {
    
  return (
    <Link to = {path}>
      <div className='flex  items-center cursor-pointer'>
          {/* icon */}
          <span className='md:w-7 md:h-7 md:mr-5 '><Icon className= 'sidemenu__icon text-black/60'/></span>

          {/* text */}
          <p className='text-lg sm:hidden md:flex text-black/70'>{text}</p>
      </div>
    </Link>
  )
}

export default MenuContent