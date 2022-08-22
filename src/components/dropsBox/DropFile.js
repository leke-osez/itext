import React from 'react';
import {UilTimes} from "@iconscout/react-unicons";

const DropFile = ({file, onCancel, two_rows, two_cols, index, isDropList, filepath}) => {
    const handleCancel = (e)=>{
        e.preventDefault()
        onCancel(index)
    }
  return (
    <div className= {`relative ${two_rows ? 'row_span_2' : ''} ${two_cols ? 'col_span_2' : ''} `}>
        <img src={isDropList ? filepath : URL.createObjectURL(file) } alt='' className='w-full h-full object-cover'/>
        {!isDropList && <button 
            onClick={handleCancel} 
            className= {`text-white absolute top-0 `}
        >
            <UilTimes className = 'w-7 h-7'/>
        </button>}
    </div>
  )
}

export default DropFile