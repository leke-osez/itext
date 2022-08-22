import React from 'react'

const DropAction = ({DropIcon, text, handleClick}) => {
  const onClick = (e)=>{
    e.stopPropagation()
    handleClick()
  }

  return (
    <button className='flex font-thin gap-1' onClick = {onClick}>
        <DropIcon className = 'drop__icon'/>
        <p>{text}</p>
    </button>
  )
}

export default DropAction