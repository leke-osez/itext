import React from "react";
import SideMenu from "./sidemenu/SideMenu";
import Widget from "./widgets/Widget";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIos, SearchOutlined } from "@mui/icons-material";
import { UilEllipsisH } from '@iconscout/react-unicons'
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import DropModal from "./dropsBox/DropModal";
import { useStateAuth } from "../context/Auth";
import SignOutModal from "./SignOutModal";
import CommentModal from "./dropPage/CommentModal";
import EditModal from "./profile/EditModal";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const { dropModal, setDropModal, setAcctMenu, signOutModal, setSignOutModal, commentModal, setCommentModal, editModal, setEditModal } = useStateAuth();

  // EXTRACT WINDOW LOCATION FROM PATH;
  const locationExtractor = (path) => {
    var rx = /\/(.*)\//g;
    var arr = path.match(rx);
    if (arr) {
      return arr[1];
    } else {
      return "";
    }
  };

  const isChatPath = () => {
    var rx = /\/(chat)/;
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
        <Modal setCommentModal = {setCommentModal}>
          <CommentModal />
        </Modal>
      )}

      {/* Modal for comment */}
      {editModal && (
        <Modal setEditModal = {setEditModal}>
          <EditModal />
        </Modal>
      )}

      {/* PAGE LAYOUT */}
      <div
        className={`sticky left-0 top-0 hidden s500:flex w-fit md:w-[23%] min-w-fit`}
      >
        <SideMenu />
      </div>

      <div className="flex-1 relative">
        {/* HEADING */} 
        {!isChatPath() && <div className="sticky top-0 left-0 w-full h-[3.5rem] border-b-[.1rem] bg-white/95 z-[40] flex items-center justify-center px-3">
          <button onClick={()=>navigate(-1)} className = 'absolute left-2 text-black/60 '><ArrowBackIos className=""/></button>
          
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

          <button className="text-black/50 absolute right-2"><UilEllipsisH/></button>
        </div>}

        {/* DYNAMIC CONTENT */}
        <Outlet />
      </div>

      {/* WIDGETS AT THE RIGHT */}
      <div
        className={`hidden s885:flex md:w-[23%] ${
          isChatPath() ? "md:hidden" : ""
        }`}
      >
        <Widget />
      </div>
    </div>
  );
};

export default Layout;
