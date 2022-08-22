import React from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { UilHeartAlt } from "@iconscout/react-unicons";
import DropAction from "../drops/DropAction";
import Moment from 'react-moment'


const Comment = ({ comment }) => {
  return (
    <div className="flex items-start mb-5 w-full">
      <div className="flex items-start mb-5 w-full">
        {/* DROP AVATAR */}
        <div className="w-20 h-5">
          <AvatarContainer src={comment?.avatar} className="avatar" />
        </div>

        {/* comment CONTENT */}
        <div className="w-full">
          {/* comment META */}
          <div className="flex items-end mb-3 w-full">
            {/* AUTHOR NAME */}
            <div className=" border-r-[.2px] px-1 text-sm">
              <p className=" text-black/90 font-medium    ">
                {comment?.authorName || "Shark"}
              </p>
              <p className=" text-black/60 font-medium">
                @{comment?.authorName || "hammerhead"}
              </p>
            </div>

            {/* comment TIMESTAMP */}
            <p className=" text-black/60 ml-3 text-sm"><Moment fromNow >{comment?.createdAt.toDate()}</Moment></p>
          </div>

          <div className={`flex flex-col w-full`}>
            {/* TEXT */}
            <p className="w-full max-w-[600px] text-base text-black font-medium  mb-4">
              {comment?.commentText}
            </p>

            {/* FILE */}

            {/* comment ACTIONS */}
            <div className="border-[.1px] rounded-b-lg flex justify-center gap-10 font-thin w-full max-w-[600px] py-2">
              <DropAction DropIcon={UilHeartAlt} text={comment?.likes.length} />
              {/* <DropAction DropIcon={UilComment} text ={comment?.comments.length}/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
