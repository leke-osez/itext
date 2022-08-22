
import React from 'react'

function TabTitle({text, isActive,name}) {
    
  return (
    <div className = 'pageTitle hover:bg-textColor/20' >
        <p className = {`${isActive? `bold`: ''}`}>{text}</p>
        {isActive ? <div className = 'titleBar bg-textColor'></div>: <div className = 'titleBar hovering'></div>}
    </div>

  )
}

export default TabTitle