import React from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Avatar } from "@mui/material";

const ProfilePic = ({ setProfile, profileImgFor, AVI, bgImgURL, bgImgFor }) => {
  return (
    <label htmlFor={bgImgFor}>
      <div className="profilePic__background">
        <div className="profilePic__backgroundLayer">
          <img
            src={bgImgURL}
            alt="user_background"
            className="profilePic__backgroundImage"
          />
        </div>

        {setProfile && <PhotoCameraIcon className="photoLogo" />}
        <label htmlFor={profileImgFor}>
          <div className={`profilePic__avatarContainer`}>
            <Avatar src={AVI} className={`profilePic__avatar`} />
            {setProfile && <PhotoCameraIcon className="photoLogo" />}
          </div>
        </label>
      </div>
    </label>
  );
};

export default ProfilePic;
