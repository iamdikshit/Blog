import React from "react";
import { MdMenu } from "react-icons/md";
import { MdClose } from "react-icons/md";
const AdminHeader = ({ menuHandler, isMenuActive }) => {
  return (
    <header className="bg-blue-700 sticky h-16 md:h-24 flex items-center justify-between px-8 md:px-16 ">
      <div className="flex gap-2 items-center justify-center">
        <button onClick={menuHandler} className="md:hidden">
          {isMenuActive ? (
            <MdClose className={`w-6 h-6 text-white cursor-pointer `} />
          ) : (
            <MdMenu className="w-6 h-6 text-white cursor-pointer" />
          )}
        </button>
        <h1 className="text-white text-xl">Job Blog</h1>
      </div>
      <nav>
        <div className="w-8 h-8 bg-slate-400 rounded-full"></div>
      </nav>
    </header>
  );
};

export default AdminHeader;
