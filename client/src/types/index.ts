export type Post = "Admin" | "Manager" | "Employee";

export interface Account {
  _id: string;
  email: string;
  name: string;
  role: string;
  post: Post;
  salary: number;
  leaves: {
    taken: {
      leaveType: "sick" | "casual";
      date: string;
    }[];
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
  productivity: string | null;
  status?: "Active" | "Inactive";
}
