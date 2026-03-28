import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import TaskManagement from "./pages/TaskManagement";
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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="timesheet" element={<Timesheet/>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />,
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default App;
