// import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import Navbar_top from "../components/Navbar_top";
import Navbar_side from "../components/Navbar_side";
import { Slide, ToastContainer } from "react-toastify";

const MainLayout = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      console.log("checking login status");
      await axios.get("/api/auth/checkloggedin").catch(() => {
        navigator("/login");
      });
      console.log("User is logged in");
    };

    checkLogin();
  }, [navigator]);

  return (
    <div className="w-full">
      <Navbar_top />
      <div className="grid grid-cols-[auto_1fr] gap-4 p-5 min-h-screen">
        <Navbar_side />
        <div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
