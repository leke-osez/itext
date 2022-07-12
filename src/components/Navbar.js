import React from 'react'
import {Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
        <h3>
            <Link to = '/'>itext</Link>
        </h3>
        <div>
            <Link>Sign up</Link>
            <Link>Login</Link>
        </div>
    </nav>
  )
}

export default Navbar