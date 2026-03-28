import { useState } from "react";
import {
  Briefcase,
  ListTodo,
  Trash2,
  CheckCircle2,
  Circle,
  LayoutList,
  Target,
} from "lucide-react";

// Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

const TaskManagement = () => {
  // Initial dummy tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      text: "Review Q3 Marketing Deck",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      text: "Approve pending leave requests",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      text: "Update weekly team sync notes",
      completed: true,
      priority: "low",
    },
    {
      id: "4",
      text: "Submit final payroll report",
      completed: false,
      priority: "high",
    },
  ]);

  const [newTaskText, setNewTaskText] = useState("");

  // Derived stats for the left panel
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen gap-12 relative bg-background text-text-primary font-sans overflow-hidden rounded-xl">
      {/* Ambient Background Gradient (replicated from Login) */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      {/* Left Panel - Productivity Dashboard */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-elevated items-center justify-center p-12 border-r border-border-subtle">
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
              <LayoutList className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Workspace
            </h1>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Track your day,
              <span className="text-primary-400"> conquer your goals.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Organize your actionable items, prioritize workflows, and maintain
              focus on what matters most.
            </p>
          </div>

          {/* Dynamic Progress Card */}
          <div className="bg-background border border-border-strong rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                Daily Progress
              </p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-extrabold text-white">
                  {progressPercentage}%
                </span>
                <span className="text-text-secondary font-medium mb-1">
                  Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-background-input rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-700 ease-out rounded-full relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm font-medium">
                <span className="text-success">{completedTasks} Done</span>
                <span className="text-text-secondary">
                  {totalTasks - completedTasks} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - To-Do List Interactive Area */}
      <div className="flex w-full lg:w-1/2 items-start justify-center p-6 sm:p-12 z-10 pt-20 lg:pt-32 h-screen overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-text-primary">Workhub</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-text-primary">My Tasks</h2>
          </div>

          {/* Task List */}
          <div className="space-y-3 mt-8">
            {tasks.length === 0 ? (
              <div className="text-center py-12 border border-border-strong border-dashed rounded-xl bg-surface/50">
                <ListTodo className="w-10 h-10 mx-auto text-text-muted mb-3 opacity-50" />
                <p className="text-text-secondary font-medium">
                  You're all caught up!
                </p>
                <p className="text-sm text-text-disabled mt-1">
                  Add a task above to get started.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    task.completed
                      ? "bg-surface/40 border-border-subtle opacity-70"
                      : "bg-surface border-border-strong hover:border-primary-500/50 shadow-sm"
                  }`}
                >
                  <div
                    className="flex items-start gap-3 flex-grow cursor-pointer"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    <button
                      className={`mt-0.5 shrink-0 focus:outline-none transition-colors ${task.completed ? "text-success" : "text-text-muted hover:text-primary-400"}`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium transition-all ${task.completed ? "text-text-muted line-through" : "text-text-primary"}`}
                      >
                        {task.text}
                      </span>
                      {!task.completed && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider mt-1 w-max px-2 py-0.5 rounded-full ${
                            task.priority === "high"
                              ? "bg-error-muted/20 text-error"
                              : task.priority === "medium"
                                ? "bg-warning-muted/20 text-warning"
                                : "bg-info-muted/20 text-info"
                          }`}
                        >
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
