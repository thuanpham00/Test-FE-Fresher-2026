export type TaskId = string;

export type TaskStatus = "To Do" | "In Progress" | "Done";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

export const TaskStatus = ["To Do", "In Progress", "Done"] as const;
export const TaskPriority = ["Low", "Medium", "High", "Urgent"] as const;