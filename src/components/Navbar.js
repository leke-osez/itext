import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import { useStateAuth } from "../context/Auth";

const Navbar = () => {
  const { user } = useStateAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/signin", { replace: true });
  };
  return (
    <nav className="bg-black text-white flex justify-between py-2 gap-3 md:px-7 px-3  ">
      <h3 className="text-xl">
        <Link to="/">itext</Link>
      </h3>
      <div className="flex md:gap-4 gap-2">
        {!user ? (
          <>
            <Link to="/signup">Sign up</Link>
            <Link to="/signin">Login</Link>{" "}
          </>
        ) : (
          <>
            <Link to="/profile">
              <div className="h-full aspect-square">
                <Avatar />
              </div>
            </Link>

            <button className="text-white capitalize" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
