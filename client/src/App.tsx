import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Leave from "./pages/Leave";

import MainLayout from "./layout/MainLayout";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./App.css";
import Payroll from "./pages/Payroll";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll/>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />,
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default App;
