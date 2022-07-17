import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateAuth } from "../../context/Auth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CameraAlt } from "@mui/icons-material";

const User = ({ profile, lastMssg, selectedUser, isUserList, user1 , smallView}) => {
  const { chat } = useStateAuth();

  const user2 = profile?.uid;
  const { avatar, name, isOnline } = profile;
  const [data, setData] = useState("");
  const selectUser = () => {
    selectedUser(profile);
  };

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      console.log(doc.data());
      setData(doc.data());
    });

    return () => unsub();
  }, []);
  return (
    <div
      className={`w-full flex items-center gap-4  cursor-pointer  ${
        isUserList && "sm:px-4 py-2 mb-3"
      } ${chat?.uid === user2 && isUserList ? "bg-slate-600/10" : ""}`}
      onClick={selectUser }
    >
      <Avatar src={avatar} className="usersAvatar" />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3">
          <p className="md:text-xl text-lg">{name}</p>
          {isOnline && (
            <div className="h-2 aspect-square rounded-full bg-green-500 p-0"></div>
          )}
        </div>
        {data && (
          <div className=" bg-green flex w-full  ">
            {/* <p className="mr-1">{data.from === user1 ? "You:  " : null}</p> */}
            <p className="truncate  text-black/60 xl:w-[80%] md:w-[70%] w-[60%]">
              {data.from === user1 ? "You:  " : null}
              {data.lastMsg ? (
                data.lastMsg
              ) : (
                <>
                  New File <CameraAlt />
                </>
              )}
            </p>
          </div>
        )}
        <p className="rounded-full bg-orange-500 text-white w-fit px-[1px] text-sm">
          {data?.unread && data?.from !== user1 ? "unread" : ""}
        </p>
      </div>
    </div>
  );
};

export default User;
