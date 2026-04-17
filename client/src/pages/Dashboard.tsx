import { useGlobalContext } from "../contexts/GlobalContext";

import AdminPanel from "../components/Admin_dashboard";
import ManagerPanel from "../components/Manager_dashboard";
import EmployeePanel from "../components/Employee_dashboard";

const Dashboard = () => {
  const { userData, isLoading } = useGlobalContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full text-error">
        Error loading user data. Please refresh.
      </div>
    );
  }

  switch (userData.post) {
    case "Admin":
      return <AdminPanel />;
    case "Manager":
      return <ManagerPanel />;
    case "Employee":
      return <EmployeePanel />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-text-muted">
          Unknown role. Cannot load dashboard.
        </div>
      );
  }
};

export default Dashboard;
