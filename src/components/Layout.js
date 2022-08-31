import React from "react";
import SideMenu from "./sidemenu/SideMenu";
import Widget from "./widgets/Widget";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIos, SearchOutlined } from "@mui/icons-material";
import { UilApps, UilEllipsisH } from "@iconscout/react-unicons";
import { useLocation } from "react-router-dom";
import Modal from "./modals/Modal";
import DropModal from "./dropsBox/DropModal";
import { useStateAuth } from "../context/Auth";
import SignOutModal from "./modals/SignOutModal";
import CommentModal from "./dropPage/CommentModal";
import EditModal from "./profile/EditModal";
import { Avatar } from "@mui/material";
import AccountDeleteModal from "./modals/AccountDeleteModal";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userProfile,
    dropModal,
    navMenu,
    setNavMenu,
    acctMenu,
    setAcctMenu,
    signOutModal,
    commentModal,
    editModal,
    setEditModal,
    setDropMenuOpen,
    dropMenuOpen,
    accountDeleteModal,
  } = useStateAuth();

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

  const pageHandler = () => {
    if (acctMenu) setAcctMenu(false);
    if (navMenu) setNavMenu(false);
    if (dropMenuOpen) setDropMenuOpen(false);
  };
  const showNavMenu = () => {
    setNavMenu(true);
  };
  const handleNavMenu = () => {
    setNavMenu(false);
  };
  return (
    <div className="flex" onClick={pageHandler}>
      {navMenu && (
        <div className="bg-black/70 fixed s500:hidden top-0 bottom-0 left-0 right-0 z-[60]"></div>
      )}
      {/* MODALS */}
      {/* Modal for drop box */}
      {dropModal && (
        <Modal  > 
          <DropModal />
        </Modal>
      )}

      {/* Modal for Sign out */}
      {signOutModal && (
        <Modal  disableCancel>
          <SignOutModal />
        </Modal>
      )}

    {accountDeleteModal && (
        <Modal  disableCancel>
          <AccountDeleteModal />
        </Modal>
      )}

      {/* Modal for comment */}
      {commentModal && (
        <Modal >
          <CommentModal />
        </Modal>
      )}

      {/* Modal for comment */}
      {editModal && (
        <Modal setEditModal={setEditModal}>
          <EditModal />
        </Modal>
      )}

      {/* PAGE LAYOUT */}
      <div
        className={` s500:sticky hidden left-0 right-0 s500:top-0  s500:flex s500:w-fit md:w-[23%] s500:min-w-fit z-[40]`}
      >
        <SideMenu />
      </div>

      {
        <div
          className={` s500:hidden nav__menu   right-0 s500:top-0 '-bottom-[6rem]' s500:w-fit md:w-[23%] s500:min-w-fit z-[100] ${
            navMenu ? "nav__menu-show" : "nav__menu-hide"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <SideMenu />
        </div>
      }

      <div className="w-full md:flex-1 relative">
        {/* HEADING */}
        {!isChatPath() && (
          <div className="dark:bg-slate-600 transition duration-50 sticky top-0 left-0 w-full h-[3.5rem] dark:border-white/40 dark:border-b-[.05rem] border-b-[.1rem] bg-white/95 z-[40] flex items-center justify-center px-3">
            {!(location.pathname === "/") && (
              <button
                onClick={() => navigate(-1)}
                className="absolute left-2 text-black/60 hidden s500:flex"
              >
                <ArrowBackIos className="dark:text-white" />
              </button>
            )}
            <span className="absolute left-2 flex s500:hidden">
              {!(location.pathname === "/") ? (
                <button
                  onClick={() => navigate(-1)}
                  className=" text-black/60 dark:text-white/90"
                >
                  <ArrowBackIos className="" />
                </button>
              ) : (
                <button className="">
                  <Avatar src={userProfile?.avatar} />
                </button>
              )}
            </span>

            <p className="absolute left-2 top-[50%] translate-y-[-50%]">
              {locationExtractor(location.pathname)}
            </p>
            <div className="md:ml-10 w-[12rem] h-[2rem] flex bg-slate-300/30 rounded-full justify-between items-center">
              <input
                className="text-xs bg-transparent h-full w-full outline-none border-none px-2 dark:text-white placeholder:text-white/80"
                placeholder="Search"
              />
              <SearchOutlined className="text-sm text-black/30 p-[0.2rem] dark:text-white" />
            </div>

            <button
              className="text-black/70 s500:hidden absolute right-2 dark:text-white/90"
              onClick={showNavMenu}
            >
              <UilApps />
            </button>
          </div>
        )}

        {/* DYNAMIC CONTENT */}
        <div className="dark:bg-slate-900">
          
        <Outlet />
        </div>
      </div>

      {/* WIDGETS AT THE RIGHT */}
      <div
        className={`hidden s885:flex md:w-[23%] ${
          isChatPath() ? "s885:hidden" : ""
        }`}
      >
        <Widget />
      </div>
    </div>
  );
};

export default Layout;
