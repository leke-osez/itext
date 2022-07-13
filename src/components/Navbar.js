import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white flex justify-between md:px-7 text-xl">
      <h3 className="text-xl">
        <Link to="/">itext</Link>
      </h3>
      <div className="flex md:gap-4 gap-2">
        <Link to="/signup">Sign up</Link>
        <Link to="/signin">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
