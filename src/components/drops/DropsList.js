import React from 'react'
import Drop from './Drop'

const DropsList = ({drops, likeDrop}) => {
  return (
    <div className='px-4'>
        {drops.map(drop=>(
          <Drop drop={drop} key={drop?.id} likeDrop={likeDrop}/>
        ))}
    </div>
  )
}

export default DropsList