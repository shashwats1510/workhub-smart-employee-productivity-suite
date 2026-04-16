import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import type { Account } from "../types";

type props = { userData: Account | null; isLoading: boolean };

const navItems = [
  {
    name: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    redirect: "/",
  },
  {
    name: "Tasks Assigned",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    redirect: "/tasks",
  },
  {
    name: "Attendance",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    redirect: "/timesheet",
  },
  {
    name: "Leaves",
    icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V7",
    redirect: "/leave",
  },
  {
    name: "Productivity",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    redirect: "/productivity",
  },
  {
    name: "Payroll",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    redirect: "/payroll",
  },
];

const Sidebar = ({ userData, isLoading }: props) => {
  console.log(userData);
  const navigator = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      navigator("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "";

  // 1. Filter the items based on the user's role
  const visibleNavItems =
    userData?.post === "Admin"
      ? navItems.filter((item) => item.name === "Dashboard")
      : navItems;

  return (
    <aside className="w-64 bg-background flex flex-col gap-6">
      <div className="flex-1 bg-surface border border-border-subtle rounded-3xl p-4 shadow-xl overflow-hidden flex flex-col">
        {/* Brand/User Section */}
        <div className="px-4 py-6 mb-4 border-b border-divider shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-900/20">
              {isLoading ? "..." : initial || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-text-primary tracking-tight truncate w-full">
                {isLoading ? "Loading..." : userData?.name || "Unknown User"}
              </p>
              <p className="text-xs text-text-muted">
                {isLoading ? "..." : userData?.post || "Employee"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5 flex-1" aria-label="Sidebar Navigation">
          {/* 2. Map over visibleNavItems instead of the full navItems array */}
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.redirect;

            return (
              <Link
                to={item.redirect}
                key={item.name}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 outline-none
                  ${
                    isActive
                      ? "bg-interactive-active text-primary-400"
                      : "text-text-secondary hover:bg-interactive-hover hover:text-text-primary"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full shadow-[2px_0_10px_rgba(99,102,241,0.6)]" />
                )}

                <svg
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive
                      ? "text-primary-400"
                      : "group-hover:text-accent-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>

                <span className="text-sm font-medium tracking-wide">
                  {item.name}
                </span>

                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus:border-primary-500 pointer-events-none" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer / Settings Link */}
        <div className="mt-auto pt-8 border-t border-divider shrink-0">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:text-error transition-colors rounded-xl hover:bg-error/5 cursor-pointer"
            onClick={handleLogout}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V7"
              />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
