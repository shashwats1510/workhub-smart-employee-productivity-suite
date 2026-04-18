import { useEffect, useState, type SubmitEvent } from "react";
import { UserPlus, Search, X, Users } from "lucide-react";
import { Slide, toast } from "react-toastify";
import axios from "axios";

import type { Account, Post } from "../types";
import User_tile from "./User_tile";

const AdminPanel = () => {
  // --- State ---
  const [users, setUsers] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    post: "Employee" as Post,
    role: "",
    phoneNo: "",
    dob: "",
    password: "",
  });

  // --- Handlers ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId("");
    setFormData({
      name: "",
      email: "",
      post: "Employee",
      role: "",
      phoneNo: "",
      dob: "",
      password: "",
    });
  };

  const handleOpenModal = async (mode: "create" | "edit", userId: string) => {
    setModalMode(mode);
    if (mode === "edit") {
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
            email: user?.email || "",
            post: user?.post || "Employee",
            role: user?.role || "",
            phoneNo: user?.phoneNo || "",
            dob: formattedDate,
            password: "",
          });
        }
      } catch (err) {
        toast.error("Failed to fetch user details");
      }
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: SubmitEvent | React.FormEvent) => {
    e.preventDefault();
    try {
      toast.promise(
        axios.post("/api/auth/create-account", { ...formData }),
        {
          pending: "Creating user account",
          success: "Account created",
          error: "Failed to create Account",
        },
        { autoClose: 3000, theme: "dark", transition: Slide }
      );
      handleCloseModal();
      getAllUsers().then((res) => { if (res.status == 200) setUsers(res.data.data); });
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  const handleEditUser = async (e: SubmitEvent | React.FormEvent) => {
    e.preventDefault();
    try {
      toast.promise(
        axios.post("/api/auth/editUserDetails", {
          ...formData,
          id: selectedUserId,
        }),
        {
          pending: "Editing User Details",
          success: "Successfully edited",
          error: "Failed to edit details",
        },
        { autoClose: 3000, theme: "dark", transition: Slide }
      );
      handleCloseModal();
      getAllUsers().then((res) => { if (res.status == 200) setUsers(res.data.data); });
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    modalMode == "create" ? handleSaveUser(e) : handleEditUser(e);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      toast.promise(
        axios.get(`/api/auth/deleteUser?id=${id}`),
        {
          pending: "Deleting User",
          success: "User Deleted",
          error: "Failed to delete user",
        },
        { autoClose: 3000, theme: "dark", transition: Slide }
      );
      handleCloseModal();
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  const getAllUsers = async () => {
    return axios.get("/api/info/getAllUsers");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res.status == 200) setUsers(res.data.data);
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
              <h1 className="text-3xl font-extrabold tracking-tight">System Accounts</h1>
              <p className="text-sm text-text-muted mt-1">
                Manage team members, roles, and access hierarchies.
              </p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-900/20 transition-all hover:scale-105"
            onClick={() => handleOpenModal("create", "")}
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
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
                    handleEditUser={handleOpenModal}
                    handleDeleteUser={handleDeleteUser}
                  />
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-text-muted font-medium bg-surface">
                      No accounts found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal overlay for Create / Edit */}
      <dialog open={isModalOpen}>
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface-elevated border border-border-strong rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-background-input/30">
              <h2 className="text-xl font-extrabold text-text-primary">
                {modalMode === "create" ? "Create New Account" : "Edit Account Details"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border-subtle transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Job Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Access Level (Post)</label>
                  <select
                    value={formData.post}
                    onChange={(e) => setFormData({ ...formData, post: e.target.value as Post })}
                    className="w-full appearance-none rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">System Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {modalMode === "create" ? "Temporary Password" : "Reset Password (Optional)"}
                </label>
                <input
                  type="password"
                  required={modalMode === "create"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder={modalMode === "create" ? "Enter a secure password" : "Leave blank to keep current password"}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-xl border border-border-strong text-text-primary hover:bg-background-input transition-colors font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-900/20 transition-all cursor-pointer"
                >
                  {modalMode === "create" ? "Create Account" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminPanel;