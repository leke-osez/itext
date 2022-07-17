import React, { useRef,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import { useStateAuth } from "../context/Auth";
import { MenuRounded } from "@mui/icons-material";

const Navbar = ({isMenu, showMenu, cancelMenu}) => {
  const { userProfile, user } = useStateAuth();
  const element = useRef();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    const confirm = window.confirm("Are you sure you want to sign out?");

    if (confirm) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          isOnline: false,
        });
        await signOut(auth);
        navigate("/signin", { replace: true });
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  return (
    <nav
      className="bg-black text-white flex justify-between py-2 gap-3 md:px-7 px-3  h-[4rem]"
      ref={element}
    >
      <div>
        <button className="sm:hidden" onClick={showMenu}>
          <MenuRounded />
        </button>
        {isMenu && (
          <div
            className="absolute bg-white min-w-[200px] p-4 pl-7 flex flex-col gap-3 z-[20] text-black shadow-md text-lg"
            style={{ top: element?.current?.clientHeight }}
          >
              <p onClick={cancelMenu}>Friends</p>
              <p onClick={cancelMenu}>Profile</p>
            <button
              className="text-orange-400 capitalize font-bold text-start"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <h3 className="text-xl sm:block hidden">
        <Link to="/">itext</Link>
      </h3>
      <div className="flex md:gap-4 gap-2">
        {!user ? (
          <>
            <Link to="/signup">Sign up</Link>
            <Link to="/signin">Login</Link>{" "}
          </>
        ) : (
          <div className="flex">
            <Link to="/profile">
              <div className="flex items-center gap-1">
                <p className="text-sm sm:block hidden">
                  {userProfile && userProfile.name}
                </p>
                <Avatar src={userProfile ? userProfile.avatar : ""} />
              </div>
            </Link>

            <button
              className="text-orange-400 capitalize ml-5 px-2 font-bold sm:block hidden"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
