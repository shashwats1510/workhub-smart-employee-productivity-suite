import { Briefcase, CircleUser, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar_top = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();

  // Close the menu if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle the logout process
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      navigator("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="w-full h-20 flex items-center justify-center bg-background px-2">
      <div className="w-full h-16 flex items-center justify-between px-6 bg-surface border border-border-subtle rounded-2xl shadow-2xl">
        {/* Brand Area */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Briefcase className="w-6 h-6 stroke-primary-400" />
          <span className="text-xl font-bold text-foreground">Workhub</span>
        </div>

        {/* Right Side: Menu Button & Dropdown Container */}
        {/* Added relative positioning and ref here to anchor the dropdown */}
        <div className="relative flex items-center" ref={menuRef}>
          <button
            type="button"
            className={`relative p-2 rounded-xl transition-all duration-200 hover:bg-interactive-hover hover:text-accent-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 active:bg-interactive-active cursor-pointer ${
              menuOpen
                ? "bg-interactive-active text-accent-400"
                : "text-text-primary"
            }`}
            aria-expanded={menuOpen}
            aria-label="Open user menu"
            onClick={() => setMenuOpen((state) => !state)}
          >
            <CircleUser />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border-subtle rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar_top;
