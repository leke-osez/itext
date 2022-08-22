import React, { useRef,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Avatar } from "@mui/material";
import { signOut } from "firebase/auth";
import { useStateAuth } from "../context/Auth";
import { MenuRounded, MoreVert } from "@mui/icons-material";




const Navbar = ({isMenu, showMenu, cancelMenu}) => {
  const { userProfile, user,setChatList } = useStateAuth();
  const element = useRef();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    cancelMenu()
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

  const showUsers = ()=>{
    setChatList(true)
    navigate('/')
    cancelMenu()
  }

  const showProfile = ()=>{
    navigate(`/profile/${user.uid}`)
    cancelMenu()
  }
  
  return (
    <nav
      className="bg-black text-white flex sm:flex-row flex-row-reverse justify-between py-2 gap-3 md:px-7 px-3  h-[4rem]"
      ref={element}
    >
      <div className= {`${!auth.currentUser && 'hidden'}`}>
        <button className="sm:hidden" onClick={showMenu}>
          <MoreVert/>
        </button>
        {isMenu && (
          <div
            className="absolute bg-white min-w-[200px] p-4 pl-7 flex flex-col gap-3 z-[70] text-black shadow-md text-lg right-2 text-start"
            style={{ top: element?.current?.clientHeight }}
          >
              <button className="text-start" onClick={showUsers}>Friends</button>
              <button className = "text-start" onClick={showProfile}>Profile</button>
            <button
              className="text-orange-400 capitalize font-bold text-start"
              onClick={handleSignOut}
            >
              Sign out
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
            <Link to={`/profile/${auth.currentUser.uid}`}>
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
              Signout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
