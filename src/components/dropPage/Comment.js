import React from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { UilHeartAlt } from "@iconscout/react-unicons";
import DropAction from "../drops/DropAction";
import Moment from 'react-moment';
import { useStateAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";


const Comment = ({ comment, likeComment }) => {
  const {userProfile} = useStateAuth();
  const navigate = useNavigate();

  const handleLike = ()=>{
    likeComment({id:comment.id, likeId: userProfile?.uid})
  }
  const isLiked = ()=>{
    const index = comment.likes.findIndex(like=> like === userProfile?.uid);

    if (index === -1){
      return false
    }
    return true
  }

  const selectProfile = ()=>{
    console.log('nav prof ')
    navigate(`/profile/${comment?.author}`)
  }
  return (
    <div className="flex dark:text-white/90 items-start mb-5 w-full">
      <div className="flex items-start mb-5 w-full">
        {/* DROP AVATAR */}
        <div className="w-20 h-5">
          <AvatarContainer user={comment} className="avatar" />
        </div>

        {/* comment CONTENT */}
        <div className="w-full">
          {/* comment META */}
          <div className="flex items-end mb-3 w-full">
            {/* AUTHOR NAME */}
            <div className=" flex gap-[.12rem] border-r-[.2px] text-sm" onClick={selectProfile}>
            <p className=" text-black/90 dark:text-white/90 font-medium hover:underline cursor-pointer ">
              {comment?.name}
            </p>
            {/* <p className=" text-black/60 font-medium hover:underline cursor-pointer">
              @{drop?.authorName || "hammerhead"}
            </p> */}
          </div>


            {/* comment TIMESTAMP */}
            <p className=" text-black/60 dark:text-white/70 ml-3 text-sm"><Moment fromNow >{comment?.createdAt.toDate()}</Moment></p>
          </div>

          <div className={`flex flex-col w-full`}>
            {/* TEXT */}
            <p className="w-full max-w-[600px] text-base dark:text-white/90 text-black font-medium  mb-4">
              {comment?.commentText}
            </p>

            {/* FILE */}

            {/* comment ACTIONS */}
            <div className="border-[.1px] rounded-b-lg flex justify-center gap-10 font-thin w-full max-w-[600px] py-2">
              <DropAction DropIcon={UilHeartAlt} text={comment?.likes.length} handleClick = {handleLike} isLiked = {isLiked()}/>
              {/* <DropAction DropIcon={UilComment} text ={comment?.comments.length}/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
