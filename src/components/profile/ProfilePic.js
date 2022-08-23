import React, { useEffect, useLayoutEffect, useRef } from "react";
import { UilCamera, UilTrashAlt } from "@iconscout/react-unicons";
import { Avatar } from "@mui/material";

const ProfilePic = ({ setProfile, profileImgFor, AVI, bgImgURL, bgImgFor, clearBgImg }) => {
  return (
    
      <div className="profilePic__background ">
        <div className="profilePic__backgroundLayer">
          <img
            src={bgImgURL}
            alt=""
            className="profilePic__backgroundImage bg-textColor/30 object-cover"
          />
        </div>

        {setProfile && (
          <div className="photoLogo">
            <span className = 'flex gap-3'>

            <label htmlFor={bgImgFor}>
            <div className=" flex items-center justify-center w-fit aspect-square p-2 rounded-full bg-black/70 cursor-pointer">
              <UilCamera className=" text-white" />
            </div>
            </label>

            <div className="  flex items-center justify-center w-fit aspect-square p-2 rounded-full bg-black/70 cursor-pointer" onClick = {clearBgImg}>
              <UilTrashAlt className=" text-white" />
            </div>
            </span>
          </div>
        )}
        
          <div className={`profilePic__avatarContainer`}>
            <Avatar src={AVI} className={`profilePic__avatar`} />
            {setProfile && (
              <label htmlFor={profileImgFor}>
              <div className=" photoLogo flex items-center justify-center w-fit aspect-square p-2 rounded-full bg-black/70 cursor-pointe">
                <UilCamera className=" text-white" />
              </div>
              </label>

            )}
          </div>
      </div>
  );
};

export default ProfilePic;
