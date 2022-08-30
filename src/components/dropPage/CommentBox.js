import { Avatar, CircularProgress, TextareaAutosize } from "@mui/material";
import React from "react";

const CommentBox = ({
  user,
  onChangeText,
  dropText,
  handleSubmit,
  loading,
  dropOwner
}) => {
  const handleChangeText = (e) => {
    onChangeText(e);
  };
  return (
    <div>
      <p className="text-black/60 text-base">Replying to @<span className="text-textColor italic ">{dropOwner?.username || dropOwner?.name}</span></p>
      <div className="flex gap-5 items-center">
        <Avatar src={user?.avatar} />
        <TextareaAutosize
          minRows={1}
          className="h-3 p-4 sm:w-[100%] text-base w-[80%] sm:min-w-[250px] sm:max-w-[400px]"
          placeholder="Write comment..."
          onChange={handleChangeText}
          value={dropText}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-textColor text-white text-base font-medium px-2 py-1 rounded-full"
          >
            Reply
          </button>
        )}{" "}
      </div>


    </div>

  );
};

export default CommentBox;
