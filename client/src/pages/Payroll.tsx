import { useState } from "react";
import {
  Briefcase,
  Wallet,
  TrendingUp,
  Clock,
  Award,
  Download,
  CalendarDays,
  FileText,
  ChevronDown,
} from "lucide-react";

const Payroll = () => {
  // Simulating state for month selection
  const [selectedMonth, setSelectedMonth] = useState("October 2023");

  // Dummy payroll data
  const payrollData = {
    role: "Senior Full-Stack Engineer",
    performanceRating: "Exceeds Expectations",
    baseSalary: 7500.0,
    hourlyRate: 55.0,
    overtimeHours: 12,
    incentives: 1250.0,
    deductions: 850.0, // Taxes, Benefits, etc.
  };

  // Derived calculations
  const overtimePay = payrollData.hourlyRate * payrollData.overtimeHours;
  const grossPay =
    payrollData.baseSalary + overtimePay + payrollData.incentives;
  const netPay = grossPay - payrollData.deductions;

  // Formatter for currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen gap-12 relative bg-background text-text-primary font-sans">
      {/* Background Ambient Gradient */}
      <div className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_top,rgba(70,2,125,0.25)_0%,transparent_70%)]"></div>

      {/* Left Panel - Compensation Summary & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-elevated items-center justify-center p-12 border-r border-border-subtle">
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
              <Wallet className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              My Payroll
            </h1>
          </div>

          {/* Role & Performance Card */}
          <div className="bg-background-input/50 border border-border-strong rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-1">
              Current Role
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-text-primary">
                {payrollData.role}
              </h2>
            </div>

            <div className="h-px w-full bg-border-subtle my-4"></div>

            <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">
              Performance Tier
            </p>
            <div className="inline-flex items-center gap-2 bg-success-muted/30 border border-success/20 text-success px-3 py-1.5 rounded-lg text-sm font-semibold">
              <Award className="w-4 h-4" />
              {payrollData.performanceRating}
            </div>
          </div>

          {/* Net Pay Highlight */}
          <div className="bg-linear-to-br from-primary-900 to-background border border-primary-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <p className="text-primary-200 font-medium mb-2 relative z-10">
              Total Net Pay ({selectedMonth})
            </p>
            <h3 className="text-5xl font-extrabold text-white tracking-tight relative z-10">
              {formatCurrency(netPay)}
            </h3>
            <p className="text-primary-300 mt-2 text-sm relative z-10">
              Your salary has been successfully processed and deposited.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Payroll Breakdown Ledger */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">My Payroll</span>
          </div>

          {/* Header & Month Selector */}
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <h2 className="text-2xl font-bold">Payslip Details</h2>
              <p className="text-sm text-text-secondary mt-1">
                Review your earnings and deductions
              </p>
            </div>

            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2 bg-background-input border border-border-strong px-4 py-2 rounded-lg hover:border-primary-500 transition-colors">
                <CalendarDays className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium">{selectedMonth}</span>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </div>
            </div>
          </div>

          {/* Ledger Breakdown */}
          <div className="bg-surface p-6 rounded-2xl border border-border-subtle shadow-lg space-y-6">
            {/* Earnings Section */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                Earnings
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background-input flex items-center justify-center">
                      <FileText className="w-4 h-4 text-text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Base Salary</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(payrollData.baseSalary)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background-input flex items-center justify-center">
                      <Clock className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">
                        Hourly Pay (Overtime)
                      </span>
                      <span className="text-xs text-text-muted">
                        {payrollData.overtimeHours} hrs @{" "}
                        {formatCurrency(payrollData.hourlyRate)}/hr
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(overtimePay)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success-muted/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">
                      Performance Incentives
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-success">
                    +{formatCurrency(payrollData.incentives)}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-border-subtle"></div>

            {/* Deductions Section */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                Deductions
              </h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-error-muted/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-error rotate-180" />
                  </div>
                  <span className="text-sm font-medium">Taxes & Benefits</span>
                </div>
                <span className="text-sm font-semibold text-error">
                  -{formatCurrency(payrollData.deductions)}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-border-strong border-dashed border-t"></div>

            {/* Totals */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-text-secondary">
                Gross Pay
              </span>
              <span className="text-base font-bold text-text-secondary">
                {formatCurrency(grossPay)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-text-primary">
                Net Pay
              </span>
              <span className="text-xl font-extrabold text-primary-400">
                {formatCurrency(netPay)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background transition-all bg-secondary hover:bg-secondary-hover hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            Download Payslip (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
