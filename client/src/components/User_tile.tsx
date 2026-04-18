import {
  Edit2,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  ListTodo,
} from "lucide-react";
import type { Account, Post } from "../types";

interface props extends Account {
  handleEditUser: (mode: "create" | "edit", user: string) => void;
  handleDeleteUser?: (id: string) => void;
  isManager?: boolean;
  handleViewTasks?: (id: string, name: string) => void;
}

const User_tile = ({
  _id,
  name,
  email,
  post,
  role,
  phoneNo,
  dob,
  status,
  handleEditUser,
  handleDeleteUser,
  isManager,
  handleViewTasks,
}: props) => {
  
  const getpostBadge = (post: Post) => {
    switch (post) {
      case "Admin":
        return (
          <span className="flex w-max items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-error-muted/20 text-error border border-error/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case "Manager":
        return (
          <span className="flex w-max items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary/20 text-secondary border border-secondary/20">
            <Shield className="w-3.5 h-3.5" /> Manager
          </span>
        );
      default:
        return (
          <span className="flex w-max items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-background-input text-text-secondary border border-border-strong">
            <User className="w-3.5 h-3.5" /> Employee
          </span>
        );
    }
  };

  // Generate an avatar initial
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <tr className="group hover:bg-background-input/30 transition-colors duration-200 border-b border-border-subtle last:border-none">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold shadow-inner">
            {initial}
          </div>
          <div>
            <div className="font-bold text-text-primary">{name}</div>
            <div className="text-xs text-text-muted mt-0.5">{email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{getpostBadge(post)}</td>
      <td className="px-6 py-4">
        <span className="font-medium text-text-secondary">{role}</span>
      </td>
      <td className="px-6 py-4 text-sm text-text-secondary">{phoneNo}</td>
      <td className="px-6 py-4 text-sm text-text-secondary">
        {dob ? new Date(dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
            status === "Active" ? "text-success" : "text-text-muted"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full shadow-sm ${
              status === "Active" ? "bg-success shadow-success/50" : "bg-text-disabled"
            }`}
          ></span>
          {status || "Unknown"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          
          {/* View Tasks Button */}
          {isManager && handleViewTasks && (
            <button
              className="p-2 rounded-lg text-text-secondary hover:text-primary-400 hover:bg-primary-400/10 transition-all"
              title="View Tasks"
              onClick={() => handleViewTasks(_id, name)}
            >
              <ListTodo className="w-4 h-4" />
            </button>
          )}

          {/* Edit Button */}
          <button
            className="p-2 rounded-lg text-text-secondary hover:text-primary-400 hover:bg-primary-400/10 transition-all"
            title="Edit Account"
            onClick={() => handleEditUser("edit", _id)}
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          {!isManager && handleDeleteUser && (
            <button
              className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-all"
              title="Delete Account"
              onClick={() => handleDeleteUser(_id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default User_tile;