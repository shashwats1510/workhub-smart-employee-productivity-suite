import { useEffect, useState } from "react";
import { Search, X, ListTodo, Users, CheckCircle2, Circle, CalendarDays } from "lucide-react";
import { Slide, toast } from "react-toastify";
import axios from "axios";

import type { Account } from "../types";
import User_tile from "./User_tile";

// Define the Task interface based on your schema
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

  // Manager Edit Form State (Strictly limited fields)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    salary: 0,
    phoneNo: "",
    dob: "",
  });

  // --- Handlers ---

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
    setFormData({
      name: "",
      role: "",
      salary: 0,
      phoneNo: "",
      dob: "",
    });
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

        let formattedDate = "";
        if (user?.dob) {
          formattedDate = new Date(user.dob).toISOString().split("T")[0];
        }

        setFormData({
          name: user?.name || "",
          role: user?.role || "",
          salary: user?.salary || 0,
          phoneNo: user?.phoneNo || "",
          dob: formattedDate,
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
      toast.promise(
        axios.post("/api/management/editUserDetails", {
          ...formData,
          id: selectedUserId,
        }),
        {
          pending: "Updating Employee Details...",
          success: "Details successfully updated!",
          error: "Failed to update details.",
        },
        {
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        },
      );
      handleCloseEditModal();
      getAllUsers().then((res) => {
        if (res.status === 200) setUsers(res.data.data);
      });
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  // Fetch tasks specifically for the selected user
  const handleViewTasks = async (id: string, name: string) => {
    setViewingUser({ id, name });
    setViewingUserTasks([]); // Clear out previous data just in case
    setIsTasksModalOpen(true);
    setIsLoadingTasks(true);

    try {
      const res = await axios.get(`/api/management/getUserTasks?id=${id}`);
      if (res.data.success) {
        setViewingUserTasks(res.data.data);
      } else {
        toast.error("Failed to load tasks.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("An error occurred while fetching tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const getAllUsers = async () => {
    return axios.get("/api/info/getAllUsers");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res.status === 200) setUsers(res.data.data);
    });
  }, []);

  return (
    <div className="flex flex-col h-full relative bg-background text-text-primary font-sans overflow-hidden rounded-xl">
      {/* Ambient Background Gradient */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.2)_0%,transparent_70%)]"></div>

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl text-left font-extrabold tracking-tight">Team Roster</h1>
              <p className="text-sm text-text-muted mt-1">
                Manage your employees, track tasks, and update roles.
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 pt-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border-strong bg-surface/50 backdrop-blur-sm pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Users Table Card */}
          <div className="rounded-2xl border border-border-strong bg-surface-elevated shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-input/50 border-b border-border-strong text-text-muted text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Employee Details</th>
                  <th className="px-6 py-4">Permission Level</th>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4">Phone No.</th>
                  <th className="px-6 py-4">Date of Birth</th>
                  <th className="px-6 py-4">Status</th>
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
                    <td colSpan={7} className="px-6 py-16 text-center text-text-muted font-medium bg-surface">
                      No team members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --------------------------- */}
      {/* EDIT MODAL (Manager Scoped) */}
      {/* --------------------------- */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
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

      {/* --------------------------- */}
      {/* VIEW TASKS MODAL            */}
      {/* --------------------------- */}
      <dialog open={isTasksModalOpen}>
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface-elevated border border-border-strong rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-background-input/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-600/20 rounded-lg border border-primary-500/30">
                  <ListTodo className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-text-primary leading-tight">
                    {viewingUser.name}'s Tasks
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">Assigned workloads and progress</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTasksModalOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-subtle transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body / Task List */}
            <div className="bg-surface max-h-125 overflow-y-auto custom-scrollbar p-6">
              {isLoadingTasks ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <ListTodo className="w-10 h-10 mb-4 opacity-50 animate-pulse" />
                  <p className="font-medium animate-pulse">Loading tasks...</p>
                </div>
              ) : viewingUserTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <CheckCircle2 className="w-12 h-12 mb-4 text-success/50" />
                  <p className="font-medium text-text-secondary">No tasks assigned.</p>
                  <p className="text-sm mt-1">This user's board is totally clear.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {viewingUserTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        task.status 
                          ? "bg-surface/40 border-border-subtle opacity-70" 
                          : "bg-background-input/50 border-border-strong hover:border-primary-500/30"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {task.status ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.status ? "text-text-muted line-through" : "text-text-primary"}`}>
                          {task.title}
                        </p>
                        
                        {task.deadLine && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <CalendarDays className="w-3.5 h-3.5 text-text-muted" />
                            <span className={`text-xs font-medium ${
                              !task.status && new Date(task.deadLine) < new Date() 
                                ? "text-error" 
                                : "text-text-secondary"
                            }`}>
                              Due: {new Date(task.deadLine).toLocaleDateString(undefined, { 
                                month: 'short', day: 'numeric', year: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                        task.status 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-warning/10 text-warning border-warning/20"
                      }`}>
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