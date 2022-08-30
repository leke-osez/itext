import React from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";

const UsersList = ({ users, selectUser, user1 }) => {
  const navigate = useNavigate();

  return (
    <div className="body_screen bg-white w-full">
      <div className="flex justify-center w-full h-[3.5rem] items-center">
      <button onClick={()=>navigate(-1)} className = 'absolute left-2 text-black/60 '><ArrowBackIos className=""/></button>
        <p className="text-lg font-semibold text-center">Chats</p>
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="w-full px-2">
          {!users.length ? (
            <p>No chats yet...</p>
          ) : (
            users.map((user) => (
              <User
                key={user.uid}
                profile={user}
                selectedUser={selectUser}
                user1={user1}
                isUserList
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
