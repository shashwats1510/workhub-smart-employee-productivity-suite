import { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDays,
  HeartPulse,
  Coffee,
  FileText,
  Send,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { useGlobalContext } from "../contexts/GlobalContext";

const Leave = () => {
  const { userData } = useGlobalContext();

  // State for the leave application form
  const [leaveType, setLeaveType] = useState("casual leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Form submission state
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Default values while loading
  const [balances, setBalances] = useState({
    sick: { total: 0, remaining: 0 },
    casual: { total: 0, remaining: 0 },
  });

  useEffect(() => {
    if (userData && userData.leaves) {
      setBalances({
        sick: {
          total: Number(userData.leaves.sickLeave?.total) || 10,
          remaining: Number(userData.leaves.sickLeave?.remaining) || 4,
        },
        casual: {
          total: Number(userData.leaves.casualLeave?.total) || 12,
          remaining: Number(userData.leaves.casualLeave?.remaining) || 9,
        },
      });
    }
  }, [userData]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!userData?._id) {
      setErrorMessage("User session not found. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      // Assuming your proxy is set up to route /api to your backend
      const response = await axios.post("/api/management/applyforleave", {
        userId: userData._id,
        leaveType,
        startDate,
        endDate,
        reason,
      });

      if (response.data.success) {
        setShowSuccess(true);

        // Update the local balances directly from the backend response
        const newBalances = response.data.data.balances;
        setBalances({
          sick: {
            total: newBalances.sick.total,
            remaining: newBalances.sick.remaining,
          },
          casual: {
            total: newBalances.casual.total,
            remaining: newBalances.casual.remaining,
          },
        });

        // Reset form
        setStartDate("");
        setEndDate("");
        setReason("");

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error("Error applying for leave:", error);
      // Extract the error message from the backend if it exists
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to apply for leave. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-12 relative bg-background text-text-primary font-sans rounded-lg overflow-hidden">
      {/* Background Ambient Gradient */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      {/* Left Panel - Leave Balances (The "Stacks") */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1F242F77] items-center justify-center p-12 rounded-lg">
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <Briefcase className="w-8 h-8 text-primary-400" />
            <h1 className="text-4xl font-extrabold tracking-tight">
              Leave Balance
            </h1>
          </div>

          <p className="text-text-secondary text-lg mb-12">
            Monitor your available time off. Your leave stacks drain as you
            utilize your days throughout the year.
          </p>

          <div className="flex gap-12 justify-center items-end h-100">
            {/* Sick Leave Stack */}
            <div className="flex flex-col items-center gap-4 w-32">
              <div className="h-72 w-full bg-background-input border-2 border-border-strong rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-lg shadow-black/20">
                {/* Draining Fill Area */}
                <div
                  className="bg-secondary w-full transition-all duration-1000 ease-in-out relative flex items-start justify-center pt-4"
                  style={{
                    height: `${balances.sick.total > 0 ? (balances.sick.remaining / balances.sick.total) * 100 : 0}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-size-[1rem_1rem]"></div>
                  <span className="relative z-10 font-bold text-white text-xl drop-shadow-md">
                    {balances.sick.remaining}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-primary font-semibold">
                  <HeartPulse className="w-4 h-4 text-secondary" />
                  Sick Leave
                </div>
                <p className="text-sm text-text-muted mt-1">
                  {balances.sick.total} Total Days
                </p>
              </div>
            </div>

            {/* Casual Leave Stack */}
            <div className="flex flex-col items-center gap-4 w-32">
              <div className="h-72 w-full bg-background-input border-2 border-border-strong rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-lg shadow-black/20">
                {/* Draining Fill Area */}
                <div
                  className="bg-primary-500 w-full transition-all duration-1000 ease-in-out relative flex items-start justify-center pt-4"
                  style={{
                    height: `${balances.casual.total > 0 ? (balances.casual.remaining / balances.casual.total) * 100 : 0}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-size-[1rem_1rem]"></div>
                  <span className="relative z-10 font-bold text-white text-xl drop-shadow-md">
                    {balances.casual.remaining}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-primary font-semibold">
                  <Coffee className="w-4 h-4 text-primary-400" />
                  Casual Leave
                </div>
                <p className="text-sm text-text-muted mt-1">
                  {balances.casual.total} Total Days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Leave Application Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full space-y-8 bg-surface p-8 rounded-2xl border border-border-subtle shadow-xl">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Leave Dashboard</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Apply for Leave</h2>
            <p className="mt-2 text-text-secondary">
              Submit your dates and reasons for approval.
            </p>
          </div>

          {showSuccess && (
            <div className="bg-success-muted border border-success text-success rounded-md p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm font-medium">
                Leave application submitted successfully!
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-error/10 border border-error text-error rounded-md p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleApplyLeave} className="space-y-5">
            {/* Leave Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border-strong bg-background-input pl-4 pr-10 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                  required
                >
                  <option value="casual leave">Casual Leave</option>
                  <option value="sick leave">Sick Leave</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Selection (Native Calendars) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Start Date
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-border-strong bg-background-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  End Date
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full rounded-lg border border-border-strong bg-background-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Reason for Leave
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a brief reason..."
                  rows={4}
                  className="w-full rounded-lg border border-border-strong bg-background-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 transition-all bg-secondary hover:bg-secondary-hover hover:scale-[1.02]"
            >
              {isLoading ? (
                "Submitting..."
              ) : (
                <>
                  Submit Application
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Leave;
