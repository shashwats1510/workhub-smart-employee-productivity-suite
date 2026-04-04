export type Post = "Admin" | "Manager" | "Employee";
export interface Account {
  _id: string;
  email: string;
  name: string;
  post: Post;
  role: string;
  phone: string;
  dob: number;
  tasks: string[],
  productivity: string[],
  status: "Active" | "Inactive";
};