import React from "react";
import { useNavigate } from "react-router-dom";
import DropAction from "./DropAction";
import { UilHeartAlt, UilComment } from '@iconscout/react-unicons'
import DropFile from "../dropsBox/DropFile";
import { useStateAuth } from "../../context/Auth";
import { Avatar } from "@mui/material";
import Moment from 'react-moment'


const Drop = ({ drop, likeDrop }) => {
  const {setActiveDrop, userProfile, setCommentModal} = useStateAuth()
  const navigate = useNavigate();
  
  const openDrop = ()=>{
    navigate(`/drop/${drop.id}`)
    setActiveDrop(drop);
  }

  const handleComment = ()=>{
    setCommentModal(true);
    setActiveDrop(drop);

  }
  
  const handleLike = ()=>{

    likeDrop({id:drop?.id, likeId:userProfile.uid})
  }
  return (
    <div className="flex items-start mb-5">
      {/* DROP AVATAR */}
      <div className="w-20 h-5">
        <Avatar src={drop?.avatar} className="avatar" />
      </div>

      {/* DROP CONTENT */}
      <div className="w-full">
        
        {/* DROP META */}
        <div className="flex items-end mb-1">
          {/* AUTHOR NAME */}
          <div className=" border-r-[.2px] px-1 text-sm">
            <p className=" text-black/90 font-medium    ">
              {drop?.username}
            </p>
            <p className=" text-black/60 font-medium">
              @{drop?.authorName || "hammerhead"}
            </p>
          </div>

          {/* DROP TIMESTAMP */}
          
          <p className=" text-black/60 ml-3 text-sm"><Moment fromNow >{drop?.createdAt.toDate()}</Moment></p>
        </div>

        <div className={`flex flex-col w-full cursor-pointer hover:bg-slate-400/20 ${drop?.dropFilePath.length && 'border-[.2px] rounded-lg'}`} onClick = {openDrop}>
          
          {/* TEXT */}
          <p className="w-full max-w-[600px] text-base text-black font-medium  mb-4">
            {drop?.dropText}
          </p>

          {/* FILE */}
          <div className={` min-w-[200px] max-w-[600px]  ${drop?.dropFilePath.length && 'grid grid-cols-2 grid-rows-2 gap-1 aspect-[5/3]'}`}>
            {drop?.dropFilePath && (
              drop?.dropFilePath.map((filepath, i) => {
                const fileLength = drop?.dropFilePath.length
                if (fileLength === 1) {
                  return (
                    <DropFile
                      filepath={filepath}
                      key={filepath}
                      two_rows
                      two_cols
                      index={i}
                      isDropList
                    />
                  );
                }
                if (fileLength === 3 && i === 0) {
                  return (
                    <DropFile
                      filepath={filepath}
                      key={filepath}
                      two_rows
                      index={i}
                      isDropList
                    />
                  );
                }
                if (fileLength === 2) {
                  return (
                    <DropFile
                    filepath={filepath}
                    key={filepath}
                    two_rows
                    index={i}
                    isDropList
                    />
                  );
                }
                return (
                  <DropFile
                  filepath={filepath}
                  key={filepath}
                  index={i}
                  isDropList
                  />
                );
              })
            )}
          </div>
          
          {/* DROP ACTIONS */}
          <div className="border-t-[.1px] flex justify-center gap-10 font-thin w-full">
              <DropAction DropIcon={UilHeartAlt} text = {drop?.likes.length} handleClick = {handleLike}/>
              <DropAction DropIcon={UilComment} text ={drop?.comments} handleClick = {handleComment}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drop;
