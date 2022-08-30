import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query, limit, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DropsList from "../drops/DropsList";
import { useStateAuth } from "../../context/Auth";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { handleLikeDrop } from "../../lib/utils";

const ProfileContents = () => {
  const { profileContents, setProfileContents } = useStateAuth();
  const {location} = useParams();

  const locate = location ? location : 'drops';
  const setDrops = (drops,drop)=>{

    const dropLikes = ()=>{
      const dropIndex = drops.findIndex(dropItem=>dropItem.id === drop.id)
      const dropItem = drops[dropIndex]
      const isLiked = dropItem.likes.findIndex(like => like === drop.likeId)
       // NOT LIKED
       if (isLiked === -1){
        return [drop.likeId,...dropItem.likes]
      }
      return dropItem.likes.filter(like=> like !== drop.likeId)
    }
    setProfileContents({...profileContents,[locate]:profileContents[locate]?.map((dropItem)=>{
      if (dropItem.id === drop?.id){
        return{...dropItem, likes: dropLikes()}
      }
      return dropItem
    })})
  }

 
  return (
    <div className="py-6 sm:px-10 px-3">
      {profileContents[locate] ? (profileContents[locate].length ? <DropsList drops={profileContents[locate]} likeDrop = {handleLikeDrop(profileContents[locate], setDrops)}/> : <p>No {location} yet... create a drop</p>): <CircularProgress />}
    </div>
  );
};

export default ProfileContents;
