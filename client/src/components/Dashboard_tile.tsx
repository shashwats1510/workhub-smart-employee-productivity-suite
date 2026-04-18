import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface props {
  title: string;
  redirect: string;
  children: ReactNode;
}

const Dashboard_tile = ({ title, redirect, children }: props) => {
  return (
    <div className="group flex flex-col h-full bg-surface-elevated border border-border-strong rounded-3xl p-6 shadow-xl hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(99,102,241,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Title */}
      <h2 className="text-xl font-bold text-text-primary mb-6 relative z-10">
        {title}
      </h2>

      {/* Content - flex-grow pushes the link to the bottom */}
      <div className="grow relative z-10 text-text-secondary flex flex-col">
        {children}
      </div>

      {/* Details Link */}
      <div className="mt-6 pt-4 border-t border-border-subtle relative z-10">
        <Link
          to={redirect}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard_tile;