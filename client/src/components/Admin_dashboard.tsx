import React, { useState } from "react";
import { UserPlus, Search, X } from "lucide-react";

import type { Account, Post } from "../types";
import User_tile, { formatUTCDate } from "./User_tile";
const AdminPanel = () => {
  const initialUsers: Account[] = [
    {
      id: "1",
      name: "Sarah Connor",
      email: "sarah@workhub.com",
      post: "Admin",
      role: "admin",
      status: "Active",
      phone: "1234567890",
      dob: Date.UTC(2005, 5, 12),
    },
  ];
  // --- State ---
  const [users, setUsers] = useState<Account[]>(initialUsers);
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
    phone: "",
    dob: "",
    password: "",
  });

  // --- Handlers ---
  const handleOpenModal = (mode: "create" | "edit", user?: Account) => {
    setModalMode(mode);
    if (mode === "edit" && user) {
      setSelectedUserId(user.id);
      setFormData({
        name: "",
        email: "",
        post: "Employee" as Post,
        role: "",
        phone: "",
        dob: "",
        password: "",
      });
    } else {
      setSelectedUserId(null);
      setFormData({
        name: "",
        email: "",
        post: "Employee" as Post,
        role: "",
        phone: "",
        dob: "",
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      post: "Employee",
      role: "",
      phone: "",
      dob: "",
      password: "",
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      const newUser: Account = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "Active",
        post: "Admin",
        phone: "",
        dob: 0,
      };
      setUsers([...users, newUser]);
    } else if (modalMode === "edit" && selectedUserId) {
      setUsers(
        users.map((u) =>
          u.id === selectedUserId
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
              }
            : u,
        ),
      );
      // Note: you would handle the password change via an API call here if formData.password is not empty.
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone.",
      )
    ) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  function parseDate(dateStr: string) {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    return Date.UTC(yyyy, mm - 1, dd);
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans overflow-hidden border-2 rounded-lg border-accent-700">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-(--color-border-subtle) bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-2xl font-bold text-left mb-2">Accounts</h1>
            <p className="text-sm text-text-muted">
              Manage team members and post hierarchies.
            </p>
          </div>

          <button
            className="flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-4 py-2.5 rounded-lg font-medium shadow-lg shadow-(--color-secondary)/20 transition-all hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </header>

        {/* Content Area */}
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
                {filteredUsers.map((user) => (
                  <User_tile {...user} />
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-text-muted"
                    >
                      No users found matching your search.
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

            <form onSubmit={handleSaveUser} className="p-6 space-y-5">
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
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-(--color-border-subtle) bg-background-input px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) focus:border-transparent transition-all"
                  placeholder="Phone Number"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-lg border border-(--color-border-subtle) text-text-primary hover:bg-(--color-background-elevated) transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-primary-600 hover:bg-(--color-primary-500) text-white font-medium text-sm shadow-lg shadow-(--color-primary-600)/20 transition-all"
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
