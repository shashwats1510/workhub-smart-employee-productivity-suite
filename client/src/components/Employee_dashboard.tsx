import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard_tile from "./Dashboard_tile";
import { Circle, CheckCircle2, Plus, X } from "lucide-react";
import { useGlobalContext } from "../contexts/GlobalContext";

// Interface for tasks fetched from the backend
interface Task {
  _id: string;
  title: string;
  status: boolean;
}

const EmployeePanel = () => {
  const { userData } = useGlobalContext();

  // --- TASKS STATE ---
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // --- SCRATCHPAD STATE ---
  const [scratchpad, setScratchpad] = useState([
    { id: 1, text: "Review Q3 metrics", done: false },
    { id: 2, text: "Draft weekly update", done: true },
  ]);
  const [newItem, setNewItem] = useState("");

  // Fetch pending tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userData?._id) return;
      try {
        setIsLoadingTasks(true);
        const res = await axios.get(`/api/management/tasks?id=${userData._id}`);
        if (res.data.success) {
          // Filter for tasks that are NOT completed yet
          const incompleteTasks = res.data.data.filter(
            (task: Task) => !task.status,
          );
          setPendingTasks(incompleteTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks for dashboard:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [userData]);

  // --- ACTIVITY CALCULATIONS ---
  let punchInStr = "--:--";
  let punchOutStr = "--:--";
  let activeTimeStr = "--:--";

  if (userData?.attendance) {
    const todayStr = new Date().toDateString();
    // Find today's attendance record
    const todaysRecord = userData.attendance.find(
      (record) => new Date(record.date).toDateString() === todayStr,
    );

    if (todaysRecord?.clockIn) {
      const inDate = new Date(todaysRecord.clockIn);
      punchInStr = inDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Determine end time for calculation (either clockOut or right now if still working)
      const outDate = todaysRecord.clockOut
        ? new Date(todaysRecord.clockOut)
        : new Date();

      if (todaysRecord.clockOut) {
        punchOutStr = outDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Calculate time difference
      const diffMs = outDate.getTime() - inDate.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      activeTimeStr = `${diffHrs}h ${diffMins}m`;
    }
  }

  // --- LEAVE CALCULATIONS ---
  const sickRemaining = userData?.leaves?.sickLeave?.remaining ?? 0;
  const casualRemaining = userData?.leaves?.casualLeave?.remaining ?? 0;

  // --- SCRATCHPAD HANDLERS ---
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setScratchpad([
      ...scratchpad,
      { id: Date.now(), text: newItem.trim(), done: false },
    ]);
    setNewItem("");
  };

  const toggleItem = (id: number) => {
    setScratchpad(
      scratchpad.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setScratchpad(scratchpad.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full h-full p-4 animate-in fade-in zoom-in duration-300">
      {/* Main Grid Container - Fill height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-full min-h-[85vh] items-stretch">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* Top Row: Activity & Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* ACTIVITY TILE */}
            <Dashboard_tile title="Activity for the day" redirect="/timesheet">
              <div className="flex flex-col h-full justify-center space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-background-input/50 border border-border-subtle">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">
                      Punch In
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {punchInStr}
                    </span>
                  </div>
                  <div className="h-10 w-px bg-border-strong"></div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">
                      Punch Out
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {punchOutStr}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Time Active</span>
                    <span className="text-sm font-bold text-primary-400">
                      {activeTimeStr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Inactivity</span>
                    <span className="text-sm font-bold text-warning">--</span>
                  </div>
                </div>
              </div>
            </Dashboard_tile>

            {/* TASKS TILE */}
            <Dashboard_tile title="Tasks for the day" redirect="/tasks">
              <div className="flex flex-col h-full space-y-3 overflow-hidden">
                {isLoadingTasks ? (
                  <p className="text-sm text-text-muted italic">
                    Loading tasks...
                  </p>
                ) : pendingTasks.length === 0 ? (
                  <p className="text-sm text-text-muted italic">
                    No pending tasks. You're all caught up!
                  </p>
                ) : (
                  // Show up to 4 pending tasks to fit the tile nicely
                  pendingTasks.slice(0, 4).map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-background-input/50 border border-border-subtle hover:border-primary-500/30 transition-colors"
                    >
                      <div className="mt-0.5 shrink-0">
                        <Circle className="w-4 h-4 text-text-muted" />
                      </div>
                      <span className="text-sm font-medium text-text-primary truncate">
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
                {pendingTasks.length > 4 && (
                  <p className="text-xs text-primary-400 font-medium text-center pt-2">
                    + {pendingTasks.length - 4} more pending
                  </p>
                )}
              </div>
            </Dashboard_tile>
          </div>

          {/* Bottom Row: Leave Management */}
          <div className="flex-1">
            <Dashboard_tile title="Leave Management" redirect="/leave">
              <div className="flex flex-col sm:flex-row h-full items-center justify-between gap-6">
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:w-36 p-5 rounded-2xl bg-background-input/50 border border-border-subtle text-center">
                    <p className="text-3xl font-bold text-text-primary">
                      {sickRemaining}
                    </p>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-2">
                      Sick Leave
                    </p>
                  </div>
                  <div className="flex-1 sm:w-36 p-5 rounded-2xl bg-background-input/50 border border-border-subtle text-center">
                    <p className="text-3xl font-bold text-primary-400">
                      {casualRemaining}
                    </p>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-2">
                      Casual Leave
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto p-5 rounded-2xl border border-dashed border-border-strong text-center sm:text-right grow sm:grow-0">
                  <p className="text-sm text-text-secondary mb-1">
                    Pending Approvals
                  </p>
                  <p className="text-lg font-bold text-text-primary">None</p>
                </div>
              </div>
            </Dashboard_tile>
          </div>
        </div>

        {/* Right Section (Interactive Scratchpad) */}
        <div className="lg:col-span-1 h-full">
          <Dashboard_tile title="Daily Scratchpad" redirect="/tasks">
            <div className="flex flex-col h-full space-y-4 pt-2">
              {/* Add Note Form */}
              <form onSubmit={handleAddItem} className="relative">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a quick note..."
                  className="w-full bg-background-input/50 border border-border-subtle rounded-xl pl-4 pr-10 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newItem.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-primary-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {/* Checklist Items */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-87.5">
                {scratchpad.length === 0 ? (
                  <p className="text-center text-sm text-text-disabled mt-8 italic">
                    Your scratchpad is empty.
                  </p>
                ) : (
                  scratchpad.map((item) => (
                    <div
                      key={item.id}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        item.done
                          ? "bg-surface/40 border-border-subtle opacity-70"
                          : "bg-background-input/50 border-border-subtle hover:border-primary-500/30"
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <button
                        className={`mt-0.5 shrink-0 focus:outline-none transition-colors ${
                          item.done
                            ? "text-success"
                            : "text-text-muted group-hover:text-primary-400"
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <span
                        className={`text-sm font-medium flex-1 transition-all wrap-break-word ${
                          item.done
                            ? "text-text-muted line-through"
                            : "text-text-primary"
                        }`}
                      >
                        {item.text}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents checking the item when clicking delete
                          removeItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-error transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Dashboard_tile>
        </div>
      </div>
    </div>
  );
};

export default EmployeePanel;
