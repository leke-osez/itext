import React from 'react';
import DropAction from "../drops/DropAction";
import { UilHeartAlt, UilComment } from '@iconscout/react-unicons'
import DropFile from "../dropsBox/DropFile";
import { useStateAuth } from "../../context/Auth";
import { Avatar } from "@mui/material";
import Moment from 'react-moment'
import { useNavigate } from 'react-router-dom';


const DropOwner = ({drop, likeDrop}) => {

  const {userProfile} = useStateAuth();
  const navigate = useNavigate();

  const handleLike = ()=>{
    likeDrop({id:drop?.id, likeId:userProfile.uid})
  }

  const isLiked = ()=>{
    const index = drop?.likes?.findIndex(like=> like === userProfile.uid);

    if (index === -1){
      return false
    }
    return true
  }
  const selectProfile = ()=>{
    console.log('nav prof ')
    navigate(`/profile/${drop?.authorId}`)
  }
  return (
    <div className="flex items-start mb-5 dark:text-white/90">
      {/* DROP AVATAR */}
      <div className="w-20 h-5">
        <Avatar src={drop?.avatar} className="avatar" />
      </div>

      {/* DROP CONTENT */}
      <div className="w-full">
        
        {/* DROP META */}
        <div className="flex items-end mb-3">
          {/* AUTHOR NAME */}
          <div className=" border-r-[.2px] px-1 text-sm" onClick={selectProfile}>
            <p className=" text-black/90 dark:text-white/90 font-medium    ">
              {drop?.username || drop?.name }
            </p>
            {/* <p className=" text-black/60 dark:text-white/90 font-medium">
              @{drop?.authorName || "hammerhead"}
            </p> */}
          </div>

          {/* DROP TIMESTAMP */}
          <p className=" text-black/60 ml-3 text-sm dark:text-white/70"><Moment fromNow >{drop?.createdAt.toDate()}</Moment></p>
        </div>

        <div className={`flex flex-col w-full `} >
          
          {/* TEXT */}
          <p className="w-full max-w-[600px] text-base text-black font-medium  dark:text-white/90 mb-4">
            {drop?.dropText}
          </p>

          {/* FILE */}
          <div className={` min-w-[200px] max-w-[600px]  ${drop?.dropFilePath?.length && 'grid grid-cols-2 grid-rows-2 gap-1 aspect-[5/3]'}`}>
            {drop?.dropFilePath && (
              drop?.dropFilePath.map((filepath, i) => {
                const fileLength = drop?.dropFilePath?.length
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
          <div className="border-[.1px] rounded-b-lg flex justify-center gap-10 font-thin w-full max-w-[600px] py-2">
              <DropAction DropIcon={UilHeartAlt} text = {drop?.likes.length} handleClick= {handleLike} isLiked = {isLiked()}/>
              <DropAction DropIcon={UilComment} text ={drop?.comments}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropOwner