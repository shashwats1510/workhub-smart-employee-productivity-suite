export type Post = "Admin" | "Manager" | "Employee";
export interface Account {
  id: string;
  name: string;
  email: string;
  post: Post;
  role: string;
  phone: string;
  dob: number;
  status: "Active" | "Inactive";
};