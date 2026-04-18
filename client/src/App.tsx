import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Tasks from "./pages/Tasks";
import Productivity from "./pages/Productivity";

import MainLayout from "./layout/MainLayout";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./App.css";
import Timesheet from "./pages/Timesheet";
import { GlobalContextProvider } from "./contexts/GlobalContext";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="/"
          element={
            <GlobalContextProvider>
              <MainLayout />
            </GlobalContextProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="tasks" element={<Tasks/>} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="timesheet" element={<Timesheet />} />
        </Route>

        {/* These routes remain outside the GlobalContext */}
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default App;
