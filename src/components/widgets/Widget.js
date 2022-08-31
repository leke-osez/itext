import React from 'react'
import Recommended from './Recommended'

const Widget = () => {
  return (
    <div className='dark:bg-slate-800 border-l-[.3px] dark:border-none sticky top-0 h-screen w-full '>
        {/* HEADER */}
        <div className='w-full h-[3.5rem]  dark:bg-slate-600 dark:border-b-[.2px]  dark:border-white/40'></div>

        {/* WIDGET CONTENTS */}
        <div className='mt-6 px-2'>

        {/* RECOMMENDED LIST */}
        <Recommended/>
        </div>
    </div>

  )
}

export default Widget