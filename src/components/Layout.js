import React from "react";
import SideMenu from "./sidemenu/SideMenu";
import Widget from "./widgets/Widget";
import { Outlet } from "react-router-dom";
import { SearchOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import DropModal from "./dropsBox/DropModal";
import { useStateAuth } from "../context/Auth";
import SignOutModal from "./SignOutModal";
import CommentModal from "./dropPage/CommentModal";

const Layout = () => {
  const location = useLocation();
  const { dropModal, setDropModal, setAcctMenu, signOutModal, setSignOutModal, commentModal, setCommentModal } = useStateAuth();

  // EXTRACT WINDOW LOCATION FROM PATH;
  const locationExtractor = (path) => {
    var rx = /\/(.*)\//g;
    var arr = rx.exec(path);
    if (arr) {
      return arr[1];
    } else {
      return "";
    }
  };

  const isChatPath = () => {
    var rx = /\/chat/g;
    var arr = rx.exec(location.pathname);
    if (arr) {
      return true;
    } else return false;
  };

  const pageHandler = ()=>{
    setAcctMenu(false)
  }

  return (
    <div className="flex" onClick={pageHandler}>

      {/* MODALS */}
      {/* Modal for drop box */}
      {dropModal && (
        <Modal setDropModal = {setDropModal}>
          <DropModal  />
        </Modal>
      )}

      {/* Modal for Sign out */}
      {signOutModal && (
        <Modal setSignOutModal = {setSignOutModal}>
          <SignOutModal />
        </Modal>
      )}

      {/* Modal for comment */}
      {commentModal && (
        <Modal setSignOutModal = {setCommentModal}>
          <CommentModal />
        </Modal>
      )}

      {/* PAGE LAYOUT */}
      <div
        className={`sticky left-0 top-0 hidden sm:flex sm:w-fit md:w-[20%] min-w-fit ${
          isChatPath() ? "hidden" : ""
        }`}
      >
        <SideMenu />
      </div>

      <div className="flex-1 relative">
        {/* HEADING */}
        <div className="sticky top-0 left-0 w-full h-[3.5rem] border-b-[.1rem] bg-white/95 z-10 flex items-center justify-center px-3">
          <p className="absolute left-2 top-[50%] translate-y-[-50%]">
            {locationExtractor(location.pathname)}
          </p>
          <div className="ml-10 w-[12rem] h-[2rem] flex bg-slate-300/30 rounded-full justify-between items-center">
            <input
              className="text-xs bg-transparent h-full w-full outline-none border-none px-2"
              placeholder="Search"
            />
            <SearchOutlined className="text-sm text-black/30 p-[0.2rem]" />
          </div>
        </div>

        {/* DYNAMIC CONTENT */}
        <Outlet />
      </div>

      {/* WIDGETS AT THE RIGHT */}
      <div
        className={`hidden md:flex md:w-[25%] ${
          isChatPath() ? "md:hidden" : ""
        }`}
      >
        <Widget />
      </div>
    </div>
  );
};

export default Layout;
