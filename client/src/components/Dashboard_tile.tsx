import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface props {
  title: string;
  redirect: string;
  children: ReactNode;
}

const Dashboard_tile = ({ title, redirect, children }: props) => {
  return (
    <div className="border-2 border-accent-400 rounded-xl p-4 hover:scale-105 transition-all">
      <p className="text-2xl font-bold text-text-primary text-center mb-3">
        {title}
      </p>
      <div className="text-left ">{children}</div>
      <Link to={redirect} className="block text-right text-text-link ">
        Details...
      </Link>
    </div>
  );
};

export default Dashboard_tile;
