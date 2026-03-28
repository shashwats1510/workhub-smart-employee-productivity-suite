import { Edit2, Shield, ShieldAlert, Trash2, User } from "lucide-react";
import type { Account, Post } from "../types";

export function formatUTCDate(utcMilliseconds: number) {
  const date = new Date(utcMilliseconds);

  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const yyyy = date.getUTCFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

const User_tile = ({
  id,
  name,
  email,
  post,
  role,
  phone,
  dob,
  status,
}: Account) => {
  const getpostBadge = (post: Post) => {
    switch (post) {
      case "Admin":
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-error-muted text-error">
            <ShieldAlert className="w-3 h-3" /> Admin
          </span>
        );
      case "Manager":
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-secondary-active text-white">
            <Shield className="w-3 h-3" /> Manager
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-(--color-background-elevated) text-text-secondary">
            <User className="w-3 h-3" /> Employee
          </span>
        );
    }
  };

  return (
    <tr
      key={id}
      className="hover:bg-(--color-background-elevated)/50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="font-medium text-text-primary">{name}</div>
        <div className="text-sm text-text-muted">{email}</div>
      </td>
      <td className="px-6 py-4">{getpostBadge(post)}</td>
      <td className="px-6 py-4">{role}</td>
      <td className="px-6 py-4">{phone}</td>
      <td className="px-6 py-4">{formatUTCDate(dob)}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${status === "Active" ? "text-success" : "text-text-muted"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-success" : "bg-text-disabled"}`}
          ></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            className="p-2 rounded-md text-text-secondary hover:text-(--color-primary-400) hover:bg-interactive-hover transition-colors"
            title="Edit Account"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-md text-text-secondary hover:text-error hover:bg-error-muted/30 transition-colors"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default User_tile;
