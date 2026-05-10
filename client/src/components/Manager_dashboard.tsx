import { useEffect, useState } from "react";
import {
  Search,
  X,
  ListTodo,
  Users,
  CheckCircle2,
  Circle,
  CalendarDays,
  Clock,
  Check,
  Ban,
  Edit2,
} from "lucide-react";
import { Slide, toast } from "react-toastify";
import axios from "axios";

import type { Account } from "../types";
import User_tile from "./User_tile";

interface Task {
  _id: string;
  title: string;
  status: boolean;
  deadLine?: string;
}

const ManagerPanel = () => {
  // --- State ---
  const [users, setUsers] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // View Tasks Modal State
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState({ id: "", name: "" });
  const [viewingUserTasks, setViewingUserTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Manager Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    salary: 0,
    phoneNo: "",
    dob: "",
  });

  // --- Data Fetching ---

  const refreshData = async () => {
    try {
      const res = await axios.get("/api/info/getAllUsers");
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- Handlers ---

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  const handleOpenEditModal = async (
    _mode: "create" | "edit",
    userId: string,
  ) => {
    setSelectedUserId(userId);
    try {
      const res = await axios.get(`/api/info/getUserDetails?id=${userId}`);
      if (res.status === 200) {
        const user = res.data.data;
        setFormData({
          name: user?.name || "",
          role: user?.role || "",
          salary: user?.salary || 0,
          phoneNo: user?.phoneNo || "",
          dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        });
      }
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post("/api/management/editUserDetails", {
          ...formData,
          id: selectedUserId,
        }),
        {
          pending: "Updating details...",
          success: "User updated successfully!",
          error: "Update failed.",
        },
        { theme: "dark", transition: Slide },
      );
      handleCloseEditModal();
      refreshData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleViewTasks = async (id: string, name: string) => {
    setViewingUser({ id, name });
    setIsTasksModalOpen(true);
    setIsLoadingTasks(true);
    try {
      const res = await axios.get(`/api/management/getUserTasks?id=${id}`);
      if (res.data.success) {
        setViewingUserTasks(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleLeaveAction = async (
    userId: string,
    leaveId: string,
    action: "Approved" | "Declined",
  ) => {
    try {
      const res = await axios.post("/api/management/handleLeaveAction", {
        userId,
        leaveId,
        action,
        adminNote: action === "Declined" ? "Declined by Manager" : "Approved",
      });

      if (res.data.success) {
        toast.success(`Leave request ${action.toLowerCase()}!`, {
          theme: "dark",
        });
        refreshData();
      }
    } catch (error) {
      toast.error("Failed to process leave request");
    }
  };

  // --- Derived State ---

  const allPendingLeaves = users.flatMap((user) =>
    (user.leaves?.history || [])
      .filter((leave) => leave.status === "Pending")
      .map((leave) => ({ ...leave, userName: user.name, userId: user._id })),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full relative bg-background text-text-primary font-sans overflow-hidden rounded-xl">
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.2)_0%,transparent_70%)]"></div>

      <main className="flex-1 flex flex-col overflow-auto relative z-10 p-8 space-y-10">
        {/* Dashboard Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Manager Dashboard
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Review team requests and manage employee performance.
              </p>
            </div>
          </div>
        </header>

        {/* --- PENDING LEAVE REQUESTS SECTION --- */}
        {allPendingLeaves.length > 0 && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4 text-warning">
              <Clock className="w-5 h-5 animate-pulse" />
              <h2 className="text-lg font-bold tracking-tight">
                Pending Approvals ({allPendingLeaves.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allPendingLeaves.map((leave, idx) => (
                <div
                  key={leave._id || idx}
                  className="bg-surface-elevated border border-warning/30 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all hover:border-warning/50"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-warning bg-warning/10 px-2 py-1 rounded">
                        {leave.leaveType}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Applied:{" "}
                        {new Date(leave.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold mt-3 text-lg">{leave.userName}</h3>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-2 italic">
                      "{leave.reason}"
                    </p>

                    {/* Date Range & Duration */}
                    <div className="mt-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <CalendarDays className="w-4 h-4 text-primary-400" />
                        <span>
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="ml-6 text-xs font-bold text-primary-400">
                        Total: {leave.duration}{" "}
                        {leave.duration === 1 ? "Day" : "Days"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleLeaveAction(leave.userId, leave._id!, "Approved")
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 bg-success/20 hover:bg-success/30 text-success text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleLeaveAction(leave.userId, leave._id!, "Declined")
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 bg-error/20 hover:bg-error/30 text-error text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- TEAM ROSTER SECTION --- */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Team Roster</h2>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border-strong bg-surface/50 backdrop-blur-sm pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border-strong bg-surface-elevated shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-input/50 border-b border-border-strong text-text-muted text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Permission</th>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4">Phone No.</th>
                  <th className="px-6 py-4">Date Of Birth</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface">
                {filteredUsers.map((user, index) => (
                  <User_tile
                    key={user._id || index}
                    {...user}
                    handleEditUser={handleOpenEditModal}
                    isManager={true}
                    handleViewTasks={handleViewTasks}
                  />
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-text-muted font-medium bg-surface"
                    >
                      No team members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- EDIT EMPLOYEE MODAL --- */}
      <dialog open={isEditModalOpen}>
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface-elevated border border-border-strong rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-background-input/30">
              <h2 className="text-xl font-extrabold text-text-primary">
                Edit Employee Details
              </h2>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-subtle transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Job Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNo}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNo: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Base Salary ($)
                </label>
                <input
                  type="number"
                  required
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              <div className="pt-6 flex gap-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 py-3 rounded-xl border border-border-strong text-text-primary hover:bg-background-input transition-colors font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-900/20 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* --- VIEW TASKS MODAL --- */}
      <dialog open={isTasksModalOpen}>
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface-elevated border border-border-strong rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-background-input/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-600/20 rounded-lg border border-primary-500/30">
                  <ListTodo className="w-5 h-5 text-primary-400" />
                </div>
                <h2 className="text-xl font-extrabold text-text-primary">
                  {viewingUser.name}'s Tasks
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsTasksModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-subtle transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-surface max-h-125 overflow-y-auto p-6">
              {isLoadingTasks ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <ListTodo className="w-10 h-10 mb-4 opacity-50 animate-pulse" />
                  <p className="font-medium animate-pulse">Loading tasks...</p>
                </div>
              ) : viewingUserTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <CheckCircle2 className="w-12 h-12 mb-4 text-success/50" />
                  <p className="font-medium text-text-secondary">
                    No tasks assigned.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {viewingUserTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-4 bg-background-input/50 border border-border-strong rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {task.status ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted" />
                        )}
                        <span
                          className={
                            task.status
                              ? "line-through text-text-muted"
                              : "font-medium"
                          }
                        >
                          {task.title}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          task.status
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        {task.status ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManagerPanel;
