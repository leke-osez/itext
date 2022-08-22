import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { useStateAuth } from "../../context/Auth";


const Recommended = () => {
  const {userRecommendations} = useStateAuth()
  
  return (
    <div className="w-full bg-slate-200/60 rounded-md p-2">
      <p className="text-sm mb-3">Recommended</p>

    {/* RECOMMENDATIONS */}
      <div className="flex flex-col gap-2">
        {userRecommendations.map((user)=>(
          <div className="flex justify-between w-full" key = {user.uid}>
          <div className="flex gap-3">
            <Avatar src={user.avatar} className="recommended__avatar" />
            <p className="text-black/70 text-base ">{user.name}</p>
          </div>
          <button className="bg-black text-white h-fit text-xs rounded-full py-[.3rem] px-2">
            follow
          </button>
        </div>
        ))}
        {/* recommendation card */}
        

       
      </div>
    </div>
  );
};

export default Recommended;
