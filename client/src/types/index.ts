export type Post = "Admin" | "Manager" | "Employee";

export interface LeaveHistoryItem {
  _id?: string;
  leaveType: "sick" | "casual";
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "Pending" | "Approved" | "Declined";
  appliedAt: string;
  respondedAt?: string;
  adminNote?: string;
}

export interface Account {
  _id: string;
  email: string;
  name: string;
  role: string;
  post: Post;
  salary: number;
  leaves: {
    history: LeaveHistoryItem[];
    sickLeave: {
      total: number;
      remaining: number;
    };
    casualLeave: {
      total: number;
      remaining: number;
    };
  };
  attendance: {
    date: string;
    status: "Present" | "Absent" | "Half-day" | "Late";
    clockIn?: string;
    clockOut?: string;
  }[];
  phoneNo: string;
  dob: string;
  tasks: string[];
  productivity: number;
  status?: "Active" | "Inactive";
}
