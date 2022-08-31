import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateAuth } from "../context/Auth";

const Settings = () => {
  const {
    themeMode,
    setThemeMode,
    setAcctMenu,
    setSignOutModal,
    setDeleteAccountModal,
  } = useStateAuth();

  const setDark = () => {
    if (themeMode === "dark") return;
    setThemeMode("dark");
    localStorage.setItem("theme", "dark");
  };

  const setLight = () => {
    if (themeMode === "light") return;
    setThemeMode("light");
    localStorage.setItem("theme", "dark");
  };

  const deleteAccount = () => {
    setDeleteAccountModal(true);
  };

  const handleSignOut = (signOutActions) => {
    setAcctMenu(false);
    setSignOutModal(true);
  };

  return (
    <div className="px-5 flex flex-col gap-2 transition duration-50 h-screen text-black/80 dark:bg-slate-900 dark:text-white/80 md:px-10 py-10 flex flex-col text-base">
      <div className="flex flex-col  ">
        <h2 className="font-medium text-lg text-black dark:text-white">
          Theme mode
        </h2>

        <button onClick={setDark} className=" w-fit px-3 py-2">
          Dark{" "}
        </button>
        <button onClick={setLight} className="  w-fit px-3 py-2">
          Light{" "}
        </button>
      </div>

      <div className="flex flex-col ">
        <h2 className="font-medium text-lg dark:text-white text-black">
          Account
        </h2>
        <button onClick={handleSignOut} className="  px-3 py-2 w-fit">
          Signout
        </button>
        <button onClick={deleteAccount} className="  px-3 py-2 w-fit">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
