import { useGlobalContext } from "../contexts/GlobalContext";

import AdminPanel from "../components/Admin_dashboard";
import ManagerPanel from "../components/Manager_dashboard"; // Ensure this exists
import EmployeePanel from "../components/Employee_dashboard"; // Ensure this exists

const Dashboard = () => {
  const { userData, isLoading } = useGlobalContext();

  // 1. Handle the loading state so it doesn't flash errors before fetching finishes
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  // 2. Handle the edge case where the user data fails to load
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full text-error">
        Error loading user data. Please refresh.
      </div>
    );
  }

  // 3. Render the appropriate panel based on the user's post
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
