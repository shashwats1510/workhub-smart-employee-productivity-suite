import { Briefcase } from "lucide-react";

const Navbar_top = () => {
  return (
    <nav className="w-full h-20 flex items-center justify-center bg-background px-2">
      <div className="w-full h-16 flex items-center justify-between px-6 bg-surface border border-border-subtle rounded-2xl shadow-2xl">
        {/* Brand Area */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Briefcase className="w-6 h-6 stroke-primary-400" />
            <span className="text-xl font-bold text-foreground">Workhub</span>
        </div>

        {/* Right Side: Menu Button */}
        <div className="flex items-center">
          <button
            type="button"
            className="relative p-2 rounded-xl text-text-primary transition-all duration-200 hover:bg-interactive-hover hover:text-accent-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500 active:bg-interactive-active"
            aria-label="Open main menu"
            aria-expanded="false"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            {/* Optional: Status Indicator Dot */}
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar_top;
