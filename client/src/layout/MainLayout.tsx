// import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import Navbar_top from "../components/Navbar_top";
import Navbar_side from "../components/Navbar_side";

const MainLayout = () => {
  const navigator = useNavigate();
  useEffect(() => {
    console.log("checking login status");
    axios.get("/api/auth/checkloggedin").then((res) => {
      if (!res.data.loggedIn) navigator("/login");
    });
  }, []);

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
