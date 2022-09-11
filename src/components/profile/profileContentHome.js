import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query, limit, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DropsList from "../drops/DropsList";
import { useStateAuth } from "../../context/Auth";
import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

const ProfileContentsHome = () => {
  const { profileContents, profile:userProfile, } = useStateAuth();
  const [dropsData, setDropsData] = useState(null);
  const dropsRef = collection(db, "drop");
  const location = useLocation()

  useEffect(() => {
    const getDropsData = async () => {
      const dropsList = [];
      try {   


       
                const q = query(
                    dropsRef,
                    where("authorId", "==", userProfile.uid),
                    orderBy('createdAt', 'desc'),
                    limit(20),
                    
                  );
                  const drops = await getDocs(q);
                  drops.forEach((drop) => dropsList.push({id:drop.id,...drop.data()}))
          
      } catch (error) {
        console.log(error)
      }
      setDropsData(dropsList)
    };

    getDropsData()
  }, [profileContents, userProfile]);
  return (
    <div className="py-6 px-10">
      {dropsData ? <DropsList drops={dropsData} /> : <CircularProgress />}
    </div>
  );
};

export default ProfileContentsHome;
