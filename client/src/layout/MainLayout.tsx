import { Outlet } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

import Navbar_top from "../components/Navbar_top";
import Sidebar from "../components/Sidebar";
import {
  GlobalContextProvider,
} from "../contexts/GlobalContext.tsx";

const LayoutContent = () => {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-background">
      <Navbar_top />

      <div className="flex-1 grid grid-cols-[auto_1fr] gap-4 p-3 min-h-0">
        <Sidebar />

        <div className="h-full overflow-y-auto overflow-x-hidden relative rounded-3xl">
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

const MainLayout = () => {
  return (
    <GlobalContextProvider>
      <LayoutContent />
    </GlobalContextProvider>
  );
};

export default MainLayout;
