import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropAction from "./DropAction";
import {
  UilHeartAlt,
  UilComment,
  UilEllipsisH,
} from "@iconscout/react-unicons";
import DropFile from "../dropsBox/DropFile";
import { useStateAuth } from "../../context/Auth";
import { Avatar } from "@mui/material";
import Moment from "react-moment";
import { drop } from "underscore";
import { deleteDropFromDB } from "../../lib/utils";

const Drop = ({ drop, likeDrop, drops }) => {
  const {
    setActiveDrop,
    userProfile,
    setCommentModal,
    setDrops,
    setDropMenuOpen,
    dropMenuOpen,
  } = useStateAuth();
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  const openDrop = () => {
    navigate(`/drop/${drop.id}`);
    setActiveDrop(drop);
  };

  const handleComment = () => {
    setCommentModal(true);
    setActiveDrop(drop);
  };
  const isLiked = () => {
    const index = drop?.likes.findIndex((like) => like === userProfile?.uid);

    if (index === -1) {
      return false;
    }
    return true;
  };

  const selectProfile = () => {
    console.log("nav prof ");
    navigate(`/profile/${drop?.authorId}`);
  };

  const handleLike = () => {
    likeDrop({ id: drop?.id, likeId: userProfile?.uid });
  };

  const showDropMenu = (e) => {
    e.stopPropagation();
    setDrops(
      drops?.map((dropToSelect) => {
        if (dropToSelect.id === drop.id) {
          console.log(dropToSelect.id);
          dropToSelect.menuActive = true;
          return dropToSelect;
        }
        if (dropToSelect.menuActive) {
          dropToSelect.menuActive = false;
        }
        return dropToSelect;
      })
    );
    setDropMenuOpen(true);
  };

  const deleteDrop = ()=>{
    if (userProfile.uid !== drop.authorId) return

    deleteDropFromDB(drop.id)
    setDrops(drops.filter((dropToDelete)=> dropToDelete.id !== drop.id))
  }
  return (
    <div className="flex items-start mb-5 dark:text-white/90">
      {/* DROP AVATAR */}
      <div className="w-20 h-5">
        <Avatar src={drop?.avatar} className="avatar" />
      </div>

      {/* DROP CONTENT */}
      <div className="w-full max-w-[500px]">
        {/* DROP META */}
        <div className="flex justify-between">
          <div className="flex items-end mb-1">
            {/* AUTHOR NAME */}
            <div
              className=" flex gap-[.12rem] pr-2 border-r-[.2px] dark:border-white/40 dark:border-r-[.05rem] text-sm"
              onClick={selectProfile}
            >
              <p className=" dark:text-white/90 text-black/90 font-medium hover:underline cursor-pointer ">
                {drop?.name}
              </p>
              {/* <p className=" text-black/60 font-medium hover:underline cursor-pointer">
              @{drop?.authorName || "hammerhead"}
            </p> */}
            </div>

            {/* DROP TIMESTAMP */}

            <p className=" text-black/60 ml-3 text-sm dark:text-white/60">
              <Moment fromNow>{drop?.createdAt.toDate()}</Moment>
            </p>
          </div>
          <div className="relative">
            <button className="text-black/50 " onClick={showDropMenu}>
              <UilEllipsisH />
            </button>

            {drop?.menuActive && dropMenuOpen && (
              <div className="absolute top-[100%] z-[10] bg-white shadow-lg right-[0] p-3 flex flex-col gap-1 w-[170px] text-base">
                <div className="" onClick = {()=>navigate(`profile/${drop.authorId}`)}>View profile</div>
                {drop.authorId === userProfile.uid && <div onClick={deleteDrop}>Delete drop</div>}
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col w-full  cursor-pointer hover:bg-slate-400/20 ml-2 ${
            drop?.dropFilePath?.length && "border-[.2px] dark:border-white/40   dark:border-t-[0.5px] rounded-lg"
          }`}
          onClick={openDrop}
        >
          {/* TEXT */}
          <p className="w-full  text-base text-black font-medium dark:font-normal  mb-4 dark:text-white/90">
            {drop?.dropText}
          </p>

          {/* FILE */}
          <div
            className={` min-w-[200px] w-full  ${
              drop?.dropFilePath?.length &&
              "grid grid-cols-2 grid-rows-2 gap-1 aspect-[5/3]"
            }`}
          >
            {drop?.dropFilePath &&
              drop?.dropFilePath.map((filepath, i) => {
                const fileLength = drop?.dropFilePath.length;
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
              })}
          </div>

          {/* DROP ACTIONS */}
          <div className={`border-t-[.1px] rounded-b-lg dark:border-white/40 dark:border-[.05rem] flex justify-center gap-10 font-thin w-full ${drop?.dropFilePath?.length && 'border-none'}`}>
            <DropAction
              DropIcon={UilHeartAlt}
              text={drop?.likes.length}
              handleClick={handleLike}
              isLiked={isLiked()}
            />
            <DropAction
              DropIcon={UilComment}
              text={drop?.comments}
              handleClick={handleComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drop;
