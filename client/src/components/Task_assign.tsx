import { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase,
  Users,
  CalendarDays,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { useGlobalContext } from "../contexts/GlobalContext";

// Employee interface based on your backend schema
interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const TaskAssignment = () => {
  const { userData } = useGlobalContext();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Data & UI States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        // Using the requested GET route
        const res = await axios.get("/api/management/getEmployees");

        if (res.data.success) {
          // Optional: Filter out Admin/Managers if you only want to assign to "Employee" posts
          const employeeList = res.data.data;
          setEmployees(employeeList);

          // Auto-select the first employee if the list isn't empty
          if (employeeList.length > 0) {
            setAssignedTo(employeeList[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setErrorMessage("Failed to load employee list. Please refresh.");
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title || !assignedTo || !deadLine) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // POST request to the requested route, matching your task.js schema
      const payload = {
        assignedTo,
        title,
        description,
        deadLine,
        status: false, // Default status for a new task is false (incomplete)
      };

      const res = await axios.post("/api/management/createTask", payload);

      if (res.data.success) {
        setShowSuccess(true);

        // Reset the form
        setTitle("");
        setDescription("");
        setDeadLine("");
        // Keep the assignedTo the same or reset it (keeping it is usually better for managers assigning multiple tasks)

        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to assign task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen gap-12 relative bg-background text-text-primary font-sans overflow-hidden rounded-xl">
      {/* Ambient Background Gradient */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      {/* Left Panel - Information & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-elevated items-center justify-center p-12 border-r border-border-subtle">
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
              <ClipboardList className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Delegation
            </h1>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Empower your team with
              <span className="text-primary-400"> clear objectives.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Assign actionable goals, set precise deadlines, and ensure your
              workforce is aligned with the company's targets.
            </p>
          </div>

          {/* Manager Stats Card (Optional visual flair) */}
          <div className="bg-background border border-border-strong rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Users className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">
                Team Overview
              </p>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-extrabold text-white">
                  {employees.length}
                </span>
                <span className="text-text-secondary font-medium mb-1">
                  Active Members
                </span>
              </div>
              <p className="text-sm text-text-muted mt-4">
                Select from the available workforce to distribute tasks
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Task Assignment Form */}
      <div className="flex w-full lg:w-1/2 items-start justify-center p-6 sm:p-12 z-10 pt-20 lg:pt-32 h-screen overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-text-primary">Workhub</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-text-primary">
              Assign Task
            </h2>
            <p className="mt-2 text-text-secondary">
              Fill in the details below to assign a new task to an employee.
            </p>
          </div>

          {/* Feedback Messages */}
          {showSuccess && (
            <div className="bg-success-muted border border-success text-success rounded-md p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                Task successfully assigned to the employee!
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-error/10 border border-error text-error rounded-md p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Assignment Form */}
          <form onSubmit={handleAssignTask} className="space-y-5">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Task Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Update Q3 Marketing Deck"
                  className="w-full rounded-lg border border-border-strong bg-background-input px-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context or instructions..."
                  rows={3}
                  className="w-full rounded-lg border border-border-strong bg-background-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Deadline Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Deadline *
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="date"
                  value={deadLine}
                  onChange={(e) => setDeadLine(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Prevent picking past dates
                  className="w-full rounded-lg border border-border-strong bg-background-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Employee Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Assign To *
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={isLoadingEmployees || employees.length === 0}
                  className="w-full appearance-none rounded-lg border border-border-strong bg-background-input pl-10 pr-10 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  {isLoadingEmployees ? (
                    <option value="">Loading employees...</option>
                  ) : employees.length === 0 ? (
                    <option value="">No employees found</option>
                  ) : (
                    employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoadingEmployees}
              className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg py-3.5 mt-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all bg-primary-600 hover:bg-primary-500 hover:scale-[1.02]"
            >
              {isSubmitting ? (
                "Deploying Task..."
              ) : (
                <>
                  Assign Task
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;
