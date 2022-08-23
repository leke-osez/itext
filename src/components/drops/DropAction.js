import React from 'react'

const DropAction = ({DropIcon, text, handleClick, isLiked}) => {
  const onClick = (e)=>{
    e.stopPropagation()
    handleClick()
  }

  return (
    <button className={`flex font-thin gap-1 `} onClick = {onClick}>
        <DropIcon className = {`drop__icon ${isLiked ? 'text-pink-500': ''}`}/>
        <p className='text-base text-black/70'>{text}</p>
    </button>
  )
}

export default DropAction