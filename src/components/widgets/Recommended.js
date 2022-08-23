import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { useStateAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { handleFollow } from "../../lib/utils";


const Recommended = () => {
  const { userRecommendations, setUserRecommendations, userProfile} = useStateAuth()
  const navigate = useNavigate();
  const setFollowButton = (id)=>{
    return ()=>{
      const arr = userRecommendations.filter(user=> user.uid !== id);
      setUserRecommendations(userRecommendations.filter(user=> user.uid !== id))
      console.log(id)
    }
  }
  return (
    <div className="w-full bg-slate-200/60 rounded-md p-2">
      <p className="text-sm mb-3">Recommended</p>

    {/* RECOMMENDATIONS */}
      <div className="flex flex-col gap-2">
        {userRecommendations.length ? (userRecommendations.map((user)=>(
          <div className="flex justify-between w-full" key = {user.uid}>
          <div className="flex gap-3">
            <Avatar src={user.avatar} className="recommended__avatar" />
            <p className="text-black/70 text-base hover:underline cursor-pointer" onClick = {()=>navigate(`/profile/${user.uid}`)}>{user.name}</p>
          </div>
          <button className="bg-black text-white h-fit text-xs rounded-full py-[.3rem] px-2" onClick = {()=>handleFollow(user.uid,userProfile, setFollowButton(user.uid))}>
            follow
          </button>
        </div>
        ))): <p className="text-base text-black/60">No more Recommendations</p>}
        {/* recommendation card */}
        

       
      </div>
    </div>
  );
};

export default Recommended;
