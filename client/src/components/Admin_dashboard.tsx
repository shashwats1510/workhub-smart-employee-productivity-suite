import { useEffect, useState, type SubmitEvent } from "react";
import { UserPlus, Search, X } from "lucide-react";
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

          // --- Date Formatting Logic ---
          let formattedDate = "";
          if (user?.dob) {
            // Converts "2024-05-20T..." to "2024-05-20"
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

  const handleSaveUser = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      toast.promise(
        axios.post("/api/auth/create-account", { ...formData }),
        {
          pending: "Creating user account",
          success: "Account created",
          error: "Failed to create Account",
        },
        {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        },
      );
      handleCloseModal();
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  const handleEditUser = async (e: SubmitEvent) => {
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
        {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        },
      );
      handleCloseModal();
    } catch (error) {
      console.error("Validation or Server Error");
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
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
        {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        },
      );
      handleCloseModal();
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
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res.status == 200) setUsers(res.data.data);
    });
  }, []);

  return (
    // Added h-full and flex-col here to make it span the layout height
    <div className="flex flex-col h-full bg-background text-text-primary font-sans overflow-hidden border-2 rounded-lg border-accent-700">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header (Fixed at top) */}
        <header className="h-20 shrink-0 border-b border-(--color-border-subtle) bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-2xl font-bold text-left mb-2">Accounts</h1>
            <p className="text-sm text-text-muted">
              Manage team members and post hierarchies.
            </p>
          </div>

          <button
            className="flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-4 py-2.5 rounded-lg font-medium shadow-lg shadow-(--color-secondary)/20 transition-all hover:scale-105"
            onClick={() => handleOpenModal("create", "")}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </header>

        {/* Content Area (Scrolls internally) */}
        <div className="flex-1 overflow-auto p-8 z-10">
          
          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border border-(--color-border-subtle) bg-(--color-surface) overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-table-header border-b border-(--color-border-subtle) text-text-secondary text-sm">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Post</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Phone No.</th>
                  <th className="px-6 py-4 font-medium">Date of birth</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-subtle)">
                {filteredUsers.map((user, index) => (
                  <User_tile
                    key={index}
                    {...user}
                    handleEditUser={handleOpenModal}
                    handleDeleteUser={handleDeleteUser}
                  />
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-text-muted"
                    >
                      No users found
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
        <div className="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-(--color-surface) border border-(--color-border-subtle) rounded-xl w-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-(--color-border-subtle)">
              <h2 className="text-xl font-bold text-text-primary">
                {modalMode === "create"
                  ? "Create New Account"
                  : "Edit Account Details"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="Email"
                />
              </div>

              <div className="space-y-1.5">
                <select
                  value={formData.post}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      post: e.target.value as Post,
                    })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">System Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <input
                  type="password"
                  required={modalMode === "create"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder={
                    modalMode === "create"
                      ? "Enter a secure password"
                      : "Leave blank to keep current"
                  }
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="Role"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="DOB"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  required
                  value={formData.phoneNo}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNo: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="Phone Number"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-lg border border-(--color-border-subtle) text-text-primary hover:bg-(--color-background-elevated) transition-colors font-medium text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-(--color-primary-500) text-white font-medium text-sm shadow-lg shadow-(--color-primary-600)/20 transition-all cursor-pointer"
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