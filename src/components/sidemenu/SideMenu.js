import React from "react";
import MenuContent from "./MenuContent";
import {
  UilEstate,
  UilCompass,
  UilMessage,
  UilRaindropsAlt,
  UilEllipsisH,
  UilUser,
  UilSetting,
  UilSignOutAlt,
  UilTear
} from "@iconscout/react-unicons";
import { Avatar } from "@mui/material";
import { useStateAuth } from "../../context/Auth";
import logo from '../../assets/img/logo3.png'
import DropButton from "./DropButton";

const SideMenu = () => {
  const { userProfile,setDropModal, acctMenu, setAcctMenu, setSignOutModal } = useStateAuth();

  const showAcctMenu = (e)=>{
    e.stopPropagation()
    setAcctMenu(true)
  }
  return (
    <div className=" h-screen w-full sticky top-0 border-r-[.3px]">

      {/* header */}
      <div className="border-b flex gap-3 items-center py-2 px-2 h-[3.5rem]">

        {/* logo */}
        <div className="">
          <img src={logo} alt="app-logo" className="w-[2rem] h-[2rem]" />
        </div>

        {/* app name */}
        <p className="text-xl sm:hidden md:flex font-semibold">trickle</p>
      </div>

      {/* contents */}
      <div className="flex flex-col gap-2 justify-between items-center md:items-start sidemenu__contents ">
        <nav className="flex flex-col gap-5 mt-6 md:px-9 ">
          <MenuContent text="Home" Icon={UilEstate} path= '/'/>
          <MenuContent text="Drops" Icon={UilRaindropsAlt} path ='/drops'/>
          {/* <MenuContent text="Forums" Icon={UilCompass} path= '/explore'/> */}
          <MenuContent text="Profile" Icon={UilUser} path = {`/profile/${userProfile?.uid}`}/>
          <MenuContent text="Chat" Icon={UilMessage} path = '/chat'/>
          <MenuContent text="Settings" Icon={UilSetting} path = '/setting'/>
        </nav>

        {/* DROP BUTTON */}
        <div className="md:ml-9" onClick={(e)=>e.stopPropagation()}><DropButton handleModal = {()=>setDropModal(true)}/></div>


        {/* ACCOUNTS  */}
        <div className = 'relative flex gap-7 items-center w-fit md:ml-9 md:hover:bg-slate-400/40 py-2  px-2 md:rounded-full justify-between cursor-pointer' onClick={showAcctMenu}>
          
          <span className="flex items-center">
            <Avatar src={userProfile ? userProfile.avatar : ""} />
            <p className="text-lg text-black/70 md:flex hidden ml-2">
              {userProfile?.name}
            </p>

          </span>
          <span className="hidden md:flex"><UilEllipsisH className = 'text-black/70 '/></span>

          {/* ACCT MENU */}
          {
            acctMenu && (
              <div className="absolute bottom-[100%] px-4 py-4 bg-white shadow-md min-w-[120px] rounded-md cursor-text">
                <button className="flex gap-1 text-sm items-center cursor-pointer" onClick = {()=>{setAcctMenu(false); setSignOutModal(true)}}>Sign Out <UilSignOutAlt className = 'text-textColor w-5 h-5'/></button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
