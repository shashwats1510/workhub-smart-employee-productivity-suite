import { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  TrendingUp,
  Calendar,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { useGlobalContext } from "../contexts/GlobalContext";

interface Task {
  _id: string;
  title: string;
  status: boolean;
  deadLine?: string;
  completedOn?: string; // New field added
}

const initialWeeklyData = [
  { day: "Mon", fullDay: "Monday", completed: 0, assigned: 0 },
  { day: "Tue", fullDay: "Tuesday", completed: 0, assigned: 0 },
  { day: "Wed", fullDay: "Wednesday", completed: 0, assigned: 0 },
  { day: "Thu", fullDay: "Thursday", completed: 0, assigned: 0 },
  { day: "Fri", fullDay: "Friday", completed: 0, assigned: 0 },
];

const Productivity = () => {
  const { userData } = useGlobalContext();
  const [weeklyData, setWeeklyData] = useState(initialWeeklyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateProductivity = async () => {
      if (!userData?._id) return;

      try {
        setIsLoading(true);
        const res = await axios.get(`/api/management/tasks?id=${userData._id}`);

        if (res.data.success) {
          const tasks: Task[] = res.data.data;
          const newWeeklyData = JSON.parse(JSON.stringify(initialWeeklyData));

          const now = new Date();
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay() + 1),
          );
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 4);
          endOfWeek.setHours(23, 59, 59, 999);

          tasks.forEach((task) => {
            // 1. Calculate ASSIGNED tasks based on their original deadline
            if (task.deadLine) {
              const assignedDate = new Date(task.deadLine);
              if (assignedDate >= startOfWeek && assignedDate <= endOfWeek) {
                const dayIndex = assignedDate.getDay() - 1;
                if (dayIndex >= 0 && dayIndex <= 4) {
                  newWeeklyData[dayIndex].assigned += 1;
                }
              }
            }

            // 2. Calculate COMPLETED tasks based on when they were actually finished
            if (task.status === true && task.completedOn) {
              const completedDate = new Date(task.completedOn);
              if (completedDate >= startOfWeek && completedDate <= endOfWeek) {
                const dayIndex = completedDate.getDay() - 1;
                if (dayIndex >= 0 && dayIndex <= 4) {
                  newWeeklyData[dayIndex].completed += 1;
                }
              }
            }
          });

          setWeeklyData(newWeeklyData);
        }
      } catch (error) {
        console.error("Error fetching tasks for productivity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCalculateProductivity();
  }, [userData]);

  const graphWidth = 500;
  const graphHeight = 250;

  const points = weeklyData
    .map((data, index) => {
      const x = (index / (weeklyData.length - 1)) * graphWidth;

      // Calculate percentage, capping at 1 (100%) so the graph line doesn't escape the box
      let percentage = 0;
      if (data.assigned === 0) {
        percentage = data.completed > 0 ? 1 : 0;
      } else {
        percentage = Math.min(1, data.completed / data.assigned);
      }

      const y = graphHeight - percentage * (graphHeight * 0.9);
      return `${x},${y}`;
    })
    .join(" ");

  const fillPath = `M 0,${graphHeight} L ${points} L ${graphWidth},${graphHeight} Z`;

  const totalCompleted = weeklyData.reduce(
    (acc, curr) => acc + curr.completed,
    0,
  );
  const totalAssigned = weeklyData.reduce(
    (acc, curr) => acc + curr.assigned,
    0,
  );
  const weeklyAverage =
    totalAssigned === 0
      ? 0
      : Math.round((totalCompleted / totalAssigned) * 100);

  return (
    <div className="flex min-h-screen relative bg-background text-text-primary font-sans p-6 sm:p-12 justify-center items-start">
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-6xl relative z-10 space-y-12 mt-4 lg:mt-8">
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

        {isLoading ? (
          <div className="text-center py-20 text-text-muted animate-pulse font-medium text-lg">
            Calculating your efficiency...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
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

              <div className="flex-grow w-full min-h-[250px] relative mt-auto flex items-end">
                <svg
                  viewBox={`-10 -10 ${graphWidth + 20} ${graphHeight + 20}`}
                  className="w-full h-full overflow-visible drop-shadow-2xl"
                  preserveAspectRatio="none"
                >
                  <defs>
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

                  <path
                    d={fillPath}
                    fill="url(#fill-gradient)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  <polyline
                    points={points}
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {weeklyData.map((data, index) => {
                    const x = (index / (weeklyData.length - 1)) * graphWidth;

                    let percentage = 0;
                    if (data.assigned === 0) {
                      percentage = data.completed > 0 ? 1 : 0;
                    } else {
                      percentage = Math.min(1, data.completed / data.assigned);
                    }

                    const y = graphHeight - percentage * (graphHeight * 0.9);

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
                        <circle cx={x} cy={y} r="15" fill="transparent" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-text-muted text-sm font-bold uppercase tracking-wider mt-6 px-2">
                {weeklyData.map((d) => (
                  <span key={d.day}>{d.day}</span>
                ))}
              </div>
            </div>

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
                  const isEmpty = data.assigned === 0 && data.completed === 0;
                  const isPerfect =
                    data.completed >= data.assigned && data.completed > 0;

                  let ratio = 0;
                  if (data.assigned === 0) {
                    ratio = data.completed > 0 ? 100 : 0;
                  } else {
                    ratio = Math.min(
                      100,
                      Math.round((data.completed / data.assigned) * 100),
                    );
                  }

                  return (
                    <div
                      key={data.day}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border-subtle bg-background-input/50 hover:bg-background-input hover:border-primary-500/50 transition-all duration-200 group gap-4 sm:gap-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                            isPerfect
                              ? "bg-success-muted/20 border-success/30 text-success"
                              : isEmpty
                                ? "bg-surface border-border-strong text-text-disabled"
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
                          <p
                            className={`text-xs ${isEmpty ? "text-text-disabled" : "text-text-secondary"}`}
                          >
                            {isEmpty
                              ? "No activity"
                              : isPerfect
                                ? "Targets met or exceeded"
                                : `${data.assigned - data.completed} tasks remaining`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end pl-14 sm:pl-0">
                        <div className="hidden sm:block w-24 h-2 bg-background rounded-full overflow-hidden border border-border-subtle">
                          <div
                            className={`h-full rounded-full ${isPerfect ? "bg-success" : "bg-primary-500"}`}
                            style={{ width: `${ratio}%` }}
                          ></div>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <span
                            className={`text-2xl font-extrabold ${isPerfect ? "text-success" : isEmpty ? "text-text-disabled" : "text-text-primary"}`}
                          >
                            {data.completed}
                          </span>
                          <span className="text-text-muted font-medium mx-1">
                            /
                          </span>
                          <span
                            className={`${isEmpty ? "text-text-disabled" : "text-text-secondary"} font-medium`}
                          >
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
        )}
      </div>
    </div>
  );
};

export default Productivity;
