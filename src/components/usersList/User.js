import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateAuth } from "../../context/Auth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CameraAlt } from "@mui/icons-material";

const User = ({ profile, selectedUser, isUserList, user1 }) => {
  const { chat, appUsers } = useStateAuth();

  const user2 = profile?.uid;
  const { avatar, name, isOnline } = profile;
  const [data, setData] = useState("");
  const selectUser = () => {
    selectedUser(profile);
  };

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
      appUsers.map(user=>{
        if (user.uid === user2 ) {
        return user['time'] = doc.data().createdAt
      }
      return user
    })
    });

    return () => unsub();
  }, []);
  return (
    <div
      className={`w-full flex items-start gap-4  cursor-pointer  ${
        isUserList && "sm:px-4 py-2 mb-3 items-start"
      } ${chat?.uid === user2 && isUserList ? "bg-slate-600/10 dark:bg-slate-700" : ""}`}
      onClick={selectedUser ? selectUser : null }
    >
      <Avatar src={avatar} className="usersAvatar" />
      <div className="flex flex-col w-full">
        <div className="flex items-start gap-3">
          <p className="md:text-[1rem]  dark:text-white/90 text-base">{name}</p>
          {isOnline && (
            <div className="h-[.4rem] aspect-square rounded-full bg-green-500 p-0"></div>
          )}
        </div>
        {data && (
          <div className=" bg-green flex w-full relative dark:text-white/90 ">
            {/* <p className="mr-1">{data.from === user1 ? "You:  " : null}</p> */}
            <p className="truncate w-[15%] mb-2 s640:w-[18%] s700:w-[20%] s768:w-[18%] s885:w-[20%] s1000:w-[23%] s1500:w-[25%] s2000:w-[30%] overflow-x-hidden text-sm dark:text-white/90 text-black/60 fixed">
              <span></span>
              {data.lastMsg ? (
                data.lastMsg
              ) : (
                <>
                  <CameraAlt className = 'camera__logo'/>
                </>
              )}
            </p>
          </div>
        )}
        <p className="rounded-full bg-textColor text-white w-fit px-[.5rem] text-sm">
          {data?.unread && data?.from !== user1 ? `${data?.unread} unread` : ""}
        </p>
      </div>
    </div>
  );
};

export default User;
