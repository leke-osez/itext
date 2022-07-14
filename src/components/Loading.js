import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="relative">
      <div className="fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loading;
