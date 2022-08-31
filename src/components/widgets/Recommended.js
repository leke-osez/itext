import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { useStateAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { handleFollow } from "../../lib/utils";

const Recommended = () => {
  const { userRecommendations, setUserRecommendations, userProfile } =
    useStateAuth();
  const navigate = useNavigate();
  const setFollowButton = (id) => {
    return () => {
      const arr = userRecommendations.filter((user) => user.uid !== id);
      setUserRecommendations(arr);
    };
  };
  return (
    <div className="w-full dark:bg-slate-700 bg-slate-200/60 rounded-md p-2">
      <p className="text-sm mb-3 dark:text-white/90">Recommended</p>

      {/* RECOMMENDATIONS */}
      <div className="flex flex-col gap-3">
        {userRecommendations.length ? (
          userRecommendations.map((user) => (
            <div className="flex flex-col gap-1 justify-between w-full s970:flex-row" key={user.uid}>
              <div className="flex gap-3">
                <Avatar src={user.avatar} className="recommended__avatar" />
                <p
                  className="text-black/70 dark:text-white/70 text-base hover:underline cursor-pointer"
                  onClick={() => navigate(`/profile/${user.uid}`)}
                >
                  {user.name}
                </p>
              </div>
              <button
                className="bg-black text-white h-fit text-xs rounded-full py-[.3rem] px-2"
                onClick={() =>
                  handleFollow(user.uid, userProfile, setFollowButton(user.uid))
                }
              >
                follow
              </button>
            </div>
          ))
        ) : (
          <p className="text-base text-black/x">No more Recommendations</p>
        )}
        {/* recommendation card */}
      </div>
    </div>
  );
};

export default Recommended;
