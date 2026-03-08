// import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar_top from "../components/Navbar_top";
import Navbar_side from "../components/Navbar_side";

const MainLayout = () => {
  return (
    <div className="w-full">
      <Navbar_top />
      <div className="grid grid-cols-[auto_1fr] gap-4 p-5 min-h-screen">
        <Navbar_side />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
