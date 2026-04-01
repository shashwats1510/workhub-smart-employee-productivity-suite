import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Briefcase, Lock, User, CircleAlert } from "lucide-react";

import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigator = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState(false);

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        navigator("/");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;

        if (status === 500) {
          setErrorMessage("Something went wrong!");
        } else {
          setErrorMessage(
            "An account with that email/password combination could not be found",
          );
        }
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
      setErrorState(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      axios.get("/api/auth/checkloggedin").then(
        (res) => {
          if (res.data.loggedIn) navigator("/");
        },
        () => {
          console.log("Login to continue");
        },
      );
    } catch (err) {
      console.log("Something went wrong: ", err);
    }
  }, []);

  return (
    <div className="flex min-h-screen gap-12 relative">
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.4)_0%,transparent_70%)]"></div>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary to-[hsl(var(--login-gradient-end))] items-center justify-center p-12">
        <div className="relative z-10 text-primary-foreground max-w-lg">
          <div className="flex justify-center items-center gap-1 mb-4">
            <Briefcase className="w-6 h-6 stroke-primary-400" />
            <span className="text-2xl font-bold tracking-tight text-primary-400">
              Workhub
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Smart Employee
            <br />
            Productivity Suite
          </h1>

          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Streamline workflows, track performance, and empower your team to do
            their best work — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {["Task Tracking", "Team Insights", "Time Sheets"].map((f) => (
              <div
                key={f}
                className="rounded-xl bg-primary-300 text-background-secondary backdrop-blur-sm py-2 font-medium text-center"
              >
                <p className="text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Workhub</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div
            className={`border border-error rounded-md p-2 flex ${errorState ? "shown" : "hidden"}`}
          >
            <CircleAlert className="stroke-error" />
            <p>{errorMessage}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background-input"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-input bg-card pl-10 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline cursor-pointer"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 transition-all bg-secondary hover:bg-secondary-hover hover:scale-105"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Contact your admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
