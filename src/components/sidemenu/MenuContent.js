import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateAuth } from '../../context/Auth'

const MenuContent = ({text,Icon,path}) => {
  const {setNavMenu} = useStateAuth()
    const navigate = useNavigate()

    const handleNavigate = ()=>{
      setNavMenu(false)
      navigate(path)
    }
  return (
    <button onClick={handleNavigate}>
      <div className='flex flex-col s500:flex-row mx-2 items-center cursor-pointer'>
          {/* icon */}
          <span className='sm:w-7 sm:h-7 sm:mr-2 md:mr-5'><Icon className= 'sidemenu__icon text-black/60'/></span>

          {/* text */}
          <p className='text-medium mt-[.3rem] s500:mt-0 md:text-lg s500:hidden s768:flex  text-black/70'>{text}</p>
      </div>
    </button>
  )
}

export default MenuContent