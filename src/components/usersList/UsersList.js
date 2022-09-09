import React from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";

const UsersList = ({ users, selectUser, user1 }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen dark:text-white/90 bg-white dark:bg-slate-800 dark:border-l-[0.2px] dark:border-white/40 w-full">
      <div className="flex justify-center w-full h-[3.5rem] sticky top-0  bg-white dark:bg-slate-800 z-[30] items-center">
      <button onClick={()=>navigate(-1)} className = 'absolute left-2 dark:text-white/80 text-black/60 '><ArrowBackIos className=""/></button>
        <p className="text-lg font-semibold text-center dark:text-white/90">Chats</p>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
       
        <div className="w-full overflow-y-scroll h-screen flex flex-col gap-2 dark:text-white/90">
          {!users.length ? (
            <p>No chats yet...</p>
          ) : (
            users.map((user) => (
              <>
              <User
                key={user.uid}
                profile={user}
                selectedUser={selectUser}
                user1={user1}
                isUserList
              />
              
              </>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
};

export default UsersList;
