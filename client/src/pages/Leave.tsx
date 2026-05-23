import { useState, useEffect } from "react";
import axios from "axios";
import {
  HeartPulse,
  Coffee,
  Send,
  CheckCircle2,
  Briefcase,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import { useGlobalContext } from "../contexts/GlobalContext";

const today = new Date().toISOString().split("T")[0];

const Leave = () => {
  const { userData, setUserData } = useGlobalContext();

  const [leaveType, setLeaveType] = useState("casual leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [leaveStats, setLeaveStats] = useState({
    sick: { total: 0, remaining: 0, pending: 0 },
    casual: { total: 0, remaining: 0, pending: 0 },
  });

  useEffect(() => {
    if (userData?.leaves) {
      const history = userData.leaves.history || [];

      // Calculate pending days based on the 'duration' field in history
      const pendingSick = history
        .filter((l: any) => l.leaveType === "sick" && l.status === "Pending")
        .reduce((acc: number, curr: any) => acc + curr.duration, 0);

      const pendingCasual = history
        .filter((l: any) => l.leaveType === "casual" && l.status === "Pending")
        .reduce((acc: number, curr: any) => acc + curr.duration, 0);

      setLeaveStats({
        sick: {
          total: Number(userData.leaves.sickLeave?.total) || 0,
          remaining: Number(userData.leaves.sickLeave?.remaining) || 0,
          pending: pendingSick,
        },
        casual: {
          total: Number(userData.leaves.casualLeave?.total) || 0,
          remaining: Number(userData.leaves.casualLeave?.remaining) || 0,
          pending: pendingCasual,
        },
      });
    }
  }, [userData]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!userData?._id) return setErrorMessage("User session not found.");

    setIsLoading(true);
    try {
      const response = await axios.post("/api/management/applyforleave", {
        userId: userData._id,
        leaveType,
        startDate,
        endDate,
        reason,
      });

      if (response.data.success) {
        setShowSuccess(true);
        setStartDate("");
        setEndDate("");
        setReason("");

        const userRes = await axios.get(
          `/api/info/getuserdetails?id=${userData._id}`,
        );
        if (userRes.data.success) setUserData(userRes.data.data);

        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to apply.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Declined":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <div className="space-y-8 p-4 font-sans text-text-primary">
      <div className="flex flex-col lg:flex-row gap-8 relative bg-background rounded-lg overflow-hidden">
        <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

        {/* Left Panel - Visual Stacks */}
        <div className="lg:w-1/2 relative bg-[#1F242F77] rounded-lg p-8 flex flex-col items-center">
          <div className="w-full max-w-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-primary-400" />
              <h1 className="text-3xl font-extrabold">Leave Balance</h1>
            </div>
            <p className="text-text-secondary text-sm">
              Gray area represents <b>Pending</b> days. Colored area is your{" "}
              <b>Remaining</b> usable balance.
            </p>
          </div>

          <div className="flex gap-12 items-end">
            {/* Sick Leave Stack */}
            <div className="flex flex-col items-center gap-4 w-32">
              <div className="h-64 w-full bg-background-input border-2 border-border-strong rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-lg">
                <div
                  className="bg-text-muted/30 w-full transition-all duration-700"
                  style={{
                    height: `${(leaveStats.sick.pending / leaveStats.sick.total) * 100}%`,
                  }}
                />
                <div
                  className="bg-secondary w-full transition-all duration-1000 flex items-start justify-center pt-2"
                  style={{
                    height: `${(leaveStats.sick.remaining / leaveStats.sick.total) * 100}%`,
                  }}
                >
                  <span className="font-bold text-white">
                    {leaveStats.sick.remaining}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold flex items-center gap-1 justify-center">
                  <HeartPulse className="w-4 h-4 text-secondary" /> Sick
                </span>
              </div>
            </div>

            {/* Casual Leave Stack */}
            <div className="flex flex-col items-center gap-4 w-32">
              <div className="h-64 w-full bg-background-input border-2 border-border-strong rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-lg">
                <div
                  className="bg-text-muted/30 w-full transition-all duration-700"
                  style={{
                    height: `${(leaveStats.casual.pending / leaveStats.casual.total) * 100}%`,
                  }}
                />
                <div
                  className="bg-primary-500 w-full transition-all duration-1000 flex items-start justify-center pt-2"
                  style={{
                    height: `${(leaveStats.casual.remaining / leaveStats.casual.total) * 100}%`,
                  }}
                >
                  <span className="font-bold text-white">
                    {leaveStats.casual.remaining}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold flex items-center gap-1 justify-center">
                  <Coffee className="w-4 h-4 text-primary-400" /> Casual
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-1/2 bg-surface p-8 rounded-2xl border border-border-subtle z-10 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Request Time Off</h2>
          {showSuccess && (
            <div className="mb-4 bg-success-muted border border-success text-success p-3 rounded flex items-center gap-2 animate-in fade-in zoom-in">
              <CheckCircle2 className="w-4 h-4" /> Request sent for approval.
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 bg-error/10 border border-error text-error p-3 rounded text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-text-muted">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full mt-1 bg-background-input border border-border-strong p-3 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              >
                <option value="casual leave">Casual Leave</option>
                <option value="sick leave">Sick Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-text-muted">
                  Start
                </label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-1 bg-background-input border border-border-strong p-3 rounded-lg text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-text-muted">
                  End
                </label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-1 bg-background-input border border-border-strong p-3 rounded-lg text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-background-input border border-border-strong p-3 rounded-lg text-sm resize-none outline-none"
                placeholder="Why do you need leave?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary-hover py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-secondary/20"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Submit Request <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* --- LEAVE HISTORY SECTION --- */}
      <div className="bg-surface-elevated border border-border-strong rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border-subtle bg-background-input/30 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold">Leave History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-text-muted font-black border-b border-border-subtle bg-background-input/10">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {userData?.leaves?.history &&
              userData.leaves.history.length > 0 ? (
                [...userData.leaves.history]
                  .reverse()
                  .map((item: any, idx: number) => (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-background-input/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-background-input border border-border-strong">
                          {item.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text-secondary">
                        {item.duration} {item.duration === 1 ? "Day" : "Days"}
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-text-muted max-w-xs truncate"
                          title={item.reason}
                        >
                          {item.reason}
                        </p>
                        {item.adminNote && (
                          <p className="text-[10px] text-error mt-1 italic">
                            Note: {item.adminNote}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1.5 w-max px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(item.status)}`}
                        >
                          {item.status === "Approved" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {item.status === "Declined" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {item.status === "Pending" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-text-muted text-sm italic"
                  >
                    No leave requests found in your history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave;
