import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DropsList from "../drops/DropsList";
import { useStateAuth } from "../../context/Auth";
import { CircularProgress } from "@mui/material";

const ProfileContents = () => {
  const { profileContents, profile:userProfile, } = useStateAuth();
  const [dropsData, setDropsData] = useState(null);
  const dropsRef = collection(db, "drop");
    console.log(profileContents)
  useEffect(() => {
    const getDropsData = async () => {
      const dropsList = [];
      try {   

          switch (profileContents) {
            case "media": {
              const q = query(
                dropsRef,
                where("authorId", "==", userProfile.uid),
                where("dropFilePath", "==", "[]"),
                limit(20)
              );
              const drops = await getDocs(q);
              drops.forEach((drop) => {dropsList.push({id:drop.id,...drop.data()}); console.log(drop.data())});
              break;
            }
            case "likes":{
                console.log('likes')
              const q = query(
                dropsRef,
                where("likes", "array-contains", userProfile.uid),
                limit(20)
              );
              const drops = await getDocs(q);
              drops.forEach((drop) => {dropsList.push({id:drop.id,...drop.data()}); console.log(drop.data())});
              break;}
              case "drops":{
                console.log('empty')
                const q = query(
                    dropsRef,
                    where("authorId", "==", userProfile.uid),
                    limit(20)
                  );
                  const drops = await getDocs(q);
                  drops.forEach((drop) => dropsList.push({id:drop.id,...drop.data()}))
              break;}
            default:{
                
    
              break;}
          }
          if (!profileContents){
            
          }
      } catch (error) {
        console.log(error)
      }
      setDropsData(dropsList)
    };

    getDropsData()
  }, [profileContents]);
  return (
    <div className="py-6 px-10">
      {dropsData ? <DropsList drops={dropsData} /> : <CircularProgress />}
    </div>
  );
};

export default ProfileContents;
