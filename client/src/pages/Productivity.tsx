import { useState } from "react";
import {
  Activity,
  TrendingUp,
  Calendar,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

const Productivity = () => {
  // Weekly productivity data: completed vs assigned tasks
  const [weeklyData] = useState([
    { day: "Mon", fullDay: "Monday", completed: 6, assigned: 8 },
    { day: "Tues", fullDay: "Tuesday", completed: 12, assigned: 12 },
    { day: "Wed", fullDay: "Wednesday", completed: 18, assigned: 20 },
    { day: "Thur", fullDay: "Thursday", completed: 15, assigned: 18 },
    { day: "Fri", fullDay: "Friday", completed: 22, assigned: 22 },
  ]);

  // SVG Graph Dimensions & Calculations
  const graphWidth = 500;
  const graphHeight = 250;

  // Calculate points based on completion percentage (completed / assigned)
  const points = weeklyData
    .map((data, index) => {
      const x = (index / (weeklyData.length - 1)) * graphWidth;
      const percentage = data.completed / data.assigned;
      // Map percentage (0 to 1) to Y coordinate (graphHeight to 0)
      // Adding a 10% padding to the top so lines don't clip
      const y = graphHeight - percentage * (graphHeight * 0.9);
      return `${x},${y}`;
    })
    .join(" ");

  // Fill path for the gradient under the line
  const fillPath = `M 0,${graphHeight} L ${points} L ${graphWidth},${graphHeight} Z`;

  // Aggregate stats
  const totalCompleted = weeklyData.reduce(
    (acc, curr) => acc + curr.completed,
    0,
  );
  const totalAssigned = weeklyData.reduce(
    (acc, curr) => acc + curr.assigned,
    0,
  );
  const weeklyAverage = Math.round((totalCompleted / totalAssigned) * 100);

  return (
    <div className="flex min-h-screen relative bg-background text-text-primary font-sans p-6 sm:p-12 justify-center items-start">
      {/* Background Ambient Gradient (From Login Page) */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-6xl relative z-10 space-y-12 mt-4 lg:mt-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 border border-primary-500/30 rounded-2xl mb-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Activity className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Your productivity stats for the week
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Track your task completion rates and overall efficiency across the
            work week.
          </p>
        </div>

        {/* Main Content Grid (Left & Right Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Panel - Productivity Graph */}
          <div className="bg-surface-elevated border border-border-strong rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Efficiency Curve
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Based on task completion ratio
                </p>
              </div>
              <div className="text-right bg-background-input px-4 py-2 rounded-xl border border-border-subtle">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Weekly Avg
                </span>
                <span className="text-lg font-extrabold text-primary-400">
                  {weeklyAverage}%
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="flex-grow w-full min-h-[250px] relative mt-auto flex items-end">
              <svg
                viewBox={`-10 -10 ${graphWidth + 20} ${graphHeight + 20}`}
                className="w-full h-full overflow-visible drop-shadow-2xl"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Line Gradient: Electric Purple to Cyber Cyan */}
                  <linearGradient
                    id="line-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="var(--color-primary-500)" />
                    <stop offset="100%" stopColor="var(--color-secondary)" />
                  </linearGradient>
                  {/* Fill Gradient: Semi-transparent to transparent */}
                  <linearGradient
                    id="fill-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-secondary)"
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-background)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Shaded Area Under Line */}
                <path
                  d={fillPath}
                  fill="url(#fill-gradient)"
                  className="transition-all duration-1000 ease-in-out"
                />

                {/* The Main Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="url(#line-gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-1000 ease-in-out"
                />

                {/* Interactive Data Points */}
                {weeklyData.map((data, index) => {
                  const x = (index / (weeklyData.length - 1)) * graphWidth;
                  const y =
                    graphHeight -
                    (data.completed / data.assigned) * (graphHeight * 0.9);
                  return (
                    <g
                      key={data.day}
                      className="group/point cursor-pointer transition-transform hover:scale-150 origin-center"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="var(--color-background)"
                        stroke="var(--color-secondary)"
                        strokeWidth="3"
                      />
                      <circle cx={x} cy={y} r="15" fill="transparent" />{" "}
                      {/* Invisible larger hit area for easier hovering */}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-text-muted text-sm font-bold uppercase tracking-wider mt-6 px-2">
              {weeklyData.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Right Panel - Exact Numbers per Day */}
          <div className="bg-surface border border-border-strong rounded-3xl p-8 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                <Calendar className="w-5 h-5 text-primary-400" />
                Daily Breakdown
              </h2>
              <span className="text-sm font-medium text-text-muted">
                {totalCompleted} / {totalAssigned} Total
              </span>
            </div>

            <div className="space-y-4 flex-grow flex flex-col justify-center">
              {weeklyData.map((data) => {
                const isPerfect = data.completed === data.assigned;
                const ratio = Math.round(
                  (data.completed / data.assigned) * 100,
                );

                return (
                  <div
                    key={data.day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border-subtle bg-background-input/50 hover:bg-background-input hover:border-primary-500/50 transition-all duration-200 group gap-4 sm:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Indicator based on 100% completion */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                          isPerfect
                            ? "bg-success-muted/20 border-success/30 text-success"
                            : "bg-surface border-border-strong text-text-muted group-hover:border-primary-500/50 group-hover:text-primary-400"
                        }`}
                      >
                        {isPerfect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <CircleDashed className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-text-primary capitalize leading-none mb-1">
                          {data.fullDay}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          {isPerfect
                            ? "All tasks completed"
                            : "Pending tasks remaining"}
                        </p>
                      </div>
                    </div>

                    {/* Exact Numbers (Completed / Assigned) */}
                    <div className="flex items-center gap-4 sm:justify-end pl-14 sm:pl-0">
                      {/* Mini Progress Bar */}
                      <div className="hidden sm:block w-24 h-2 bg-background rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className={`h-full rounded-full ${isPerfect ? "bg-success" : "bg-primary-500"}`}
                          style={{ width: `${ratio}%` }}
                        ></div>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <span
                          className={`text-2xl font-extrabold ${isPerfect ? "text-success" : "text-text-primary"}`}
                        >
                          {data.completed}
                        </span>
                        <span className="text-text-muted font-medium mx-1">
                          /
                        </span>
                        <span className="text-text-secondary font-medium">
                          {data.assigned}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
