import { useState, useEffect } from "react";
import {
  Clock,
  Coffee,
  PlayCircle,
  StopCircle,
  Briefcase,
  RefreshCw,
  LogOut,
  LogIn,
  AlertCircle,
} from "lucide-react";

type WorkStatus = "Logged Out" | "Working" | "Break" | "Lunch Break" | "Idle";

const Timesheet = () => {
  // Live states
  const [status, setStatus] = useState<WorkStatus>("Logged Out");
  const [selectedStatus, setSelectedStatus] = useState<WorkStatus>("Working");

  // Time tracking states
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Auto-Idle Simulation State
  const [idleWarning, setIdleWarning] = useState(false);

  // Helper to format seconds into HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Helper to get current time string
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Main Timer Effect
  useEffect(() => {
    let interval: number;
    if (status === "Working") {
      interval = setInterval(() => setWorkSeconds((prev) => prev + 1), 1000);
    } else if (status === "Break" || status === "Lunch Break") {
      interval = setInterval(() => setBreakSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Idle Timeout Mechanism (Simulated for demonstration)
  // If user is on break for more than 10 seconds without clicking update, switch to Idle.
  useEffect(() => {
    let timeout: number;
    setIdleWarning(false);

    if (status === "Break" || status === "Lunch Break") {
      // Show warning at 5 seconds
      const warningTimeout = setTimeout(() => setIdleWarning(true), 5000);

      // Force idle at 10 seconds
      timeout = setTimeout(() => {
        setStatus("Idle");
        setSelectedStatus("Idle");
        setIdleWarning(false);
      }, 10000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(warningTimeout);
      };
    }
  }, [status]);

  // Actions
  const handlePunchIn = () => {
    setPunchInTime(getCurrentTime());
    setPunchOutTime(null);
    setStatus("Working");
    setSelectedStatus("Working");
    setWorkSeconds(0);
    setBreakSeconds(0);
  };

  const handlePunchOut = () => {
    setPunchOutTime(getCurrentTime());
    setStatus("Logged Out");
    setSelectedStatus("Logged Out");
  };

  const handleUpdateStatus = () => {
    if (status === "Logged Out") return; // Prevent updates if not punched in
    setStatus(selectedStatus);
    setIdleWarning(false); // Clear idle warning if they manually updated
  };

  return (
    <div className="flex min-h-screen relative bg-background text-text-primary font-sans p-6 sm:p-12 justify-center items-start">
      {/* Background Ambient Gradient (From Login Page) */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.2)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-5xl relative z-10 space-y-10 mt-4 lg:mt-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 border border-primary-500/30 rounded-2xl mb-2">
            <Clock className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Your timesheet for the day
          </h1>
          <p className="text-text-secondary text-lg">
            Manage your daily attendance, track your breaks, and monitor
            productivity.
          </p>
        </div>

        {/* Main Content Split (Left & Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT PANEL: Statistics & Logs */}
          <div className="bg-surface-elevated border border-border-strong rounded-3xl p-8 shadow-xl flex flex-col space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border-subtle pb-4">
              <Briefcase className="w-5 h-5 text-secondary" />
              Daily Summary
            </h2>

            <div className="space-y-6 flex-grow">
              <div className="flex justify-between items-center bg-background-input/50 p-4 rounded-xl border border-border-subtle">
                <span className="text-text-secondary font-medium flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Punch in:
                </span>
                <span className="font-bold text-lg">
                  {punchInTime || "--:--:--"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-background-input/50 p-4 rounded-xl border border-border-subtle">
                <span className="text-text-secondary font-medium flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Punch out:
                </span>
                <span className="font-bold text-lg">
                  {punchOutTime || "--:--:--"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-primary-900/10 p-4 rounded-xl border border-primary-800/30">
                <span className="text-text-secondary font-medium flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-primary-400" /> Work so
                  far:
                </span>
                <span className="font-extrabold text-2xl text-primary-400 font-mono tracking-wider">
                  {formatDuration(workSeconds)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-warning-muted/10 p-4 rounded-xl border border-warning-muted/30">
                <span className="text-text-secondary font-medium flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-warning" /> Breaks so far:
                </span>
                <span className="font-extrabold text-2xl text-warning font-mono tracking-wider">
                  {formatDuration(breakSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Controls & Status */}
          <div className="bg-surface border border-border-strong rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border-subtle pb-4 mb-6">
              <RefreshCw className="w-5 h-5 text-primary-400" />
              Current Status
            </h2>

            {/* Status Display Area */}
            <div className="flex-grow space-y-6">
              {/* Dynamic Status Indicator */}
              <div
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                  status === "Working"
                    ? "bg-success-muted/20 border-success text-success"
                    : status === "Idle"
                      ? "bg-error-muted/20 border-error text-error"
                      : status === "Logged Out"
                        ? "bg-background-input border-border-strong text-text-muted"
                        : "bg-warning-muted/20 border-warning text-warning"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider opacity-80">
                  Live Status
                </span>
                <span className="text-3xl font-black tracking-tight">
                  {status}
                </span>
              </div>

              {/* Status Update Form */}
              <div className="space-y-3 pt-4">
                <label className="text-sm font-medium text-text-secondary">
                  Update your status:
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value as WorkStatus)
                      }
                      disabled={status === "Logged Out"}
                      className="w-full appearance-none rounded-lg border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Working">Working</option>
                      <option value="Break">Short Break</option>
                      <option value="Lunch Break">Lunch Break</option>
                      <option value="Idle">Idle</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={status === "Logged Out"}
                    className="flex shrink-0 items-center justify-center gap-2 cursor-pointer rounded-lg px-6 py-3 text-sm font-semibold border border-border-strong hover:border-text-primary hover:bg-background-input focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Update
                  </button>
                </div>

                {/* Idle Warning Message */}
                {idleWarning && (
                  <div className="flex items-center gap-2 text-warning text-sm font-medium animate-pulse mt-2">
                    <AlertCircle className="w-4 h-4" />
                    Are you back? Please update your status to prevent timeout.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions (Punch In / Punch Out) */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border-subtle">
              <button
                onClick={handlePunchIn}
                disabled={status !== "Logged Out"}
                className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all bg-primary-600 hover:bg-primary-500 hover:scale-[1.02]"
              >
                Login for the day
              </button>

              <button
                onClick={handlePunchOut}
                disabled={status === "Logged Out"}
                className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg py-3.5 text-sm font-semibold text-white shadow-lg shadow-secondary/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 transition-all bg-secondary hover:bg-secondary-hover hover:scale-[1.02]"
              >
                <StopCircle className="w-4 h-4" />
                Logout for the day
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
