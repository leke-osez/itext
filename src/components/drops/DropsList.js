import React from 'react'
import { useStateAuth } from '../../context/Auth'
import Drop from './Drop'

const DropsList = ({drops, likeDrop}) => {
  
  return (
    <div className='flex flex-col pr-2 md:px-4 gap-3 '>
        {drops.map(drop=>(
          <Drop drop={drop} key={drop?.id} likeDrop={likeDrop}/>
        ))}
    </div>
  )
}

export default DropsList