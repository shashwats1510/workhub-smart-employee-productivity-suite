import { useGlobalContext } from "../contexts/GlobalContext";

import TaskManagement from "../components/TaskManagement";
import TaskAssignment from "../components/Task_assign";

const Tasks = () => {
  const { userData, isLoading } = useGlobalContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted animate-pulse">
        Loading workspace...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full text-error">
        Error loading user session. Please refresh.
      </div>
    );
  }
  if (userData.post === "Manager" || userData.post === "Admin") {
    return <TaskAssignment />;
  }

  return <TaskManagement />;
};

export default Tasks;
