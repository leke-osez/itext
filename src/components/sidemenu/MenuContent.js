import React from 'react'
import { Link } from 'react-router-dom'

const MenuContent = ({text,Icon,path}) => {
    
  return (
    <Link to = {path}>
      <div className='flex mx-2 items-center cursor-pointer'>
          {/* icon */}
          <span className='sm:w-7 sm:h-7 sm:mr-2 md:mr-5'><Icon className= 'sidemenu__icon text-black/60'/></span>

          {/* text */}
          <p className='text-medium md:text-lg hidden sm:flex text-black/70'>{text}</p>
      </div>
    </Link>
  )
}

export default MenuContent