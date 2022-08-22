import React from 'react'
import Recommended from './Recommended'

const Widget = () => {
  return (
    <div className='border-l-[.2px] sticky top-0 h-screen w-full px-2'>
        {/* HEADER */}
        <div className='w-full h-[3rem]'></div>

        {/* WIDGET CONTENTS */}
        <div className='mt-6'>

        {/* RECOMMENDED LIST */}
        <Recommended/>
        </div>
    </div>

  )
}

export default Widget