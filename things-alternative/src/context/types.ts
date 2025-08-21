export interface Task {
  id: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  isStarred: boolean;
  dueDate: Date;
  dueTime?: string;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
  dueDate: Date;
  dueTime?: string;
  projectId?: string; // Optional project association
  isCompleted?: boolean; // Optional completion state
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface TaskCounts {
  all: number;
  important: number;
  today: number;
}

export interface SidebarCounts {
  inbox: number;
  today: number;
  upcoming: number;
  someday: number;
  logbook: number;
  [projectId: string]: number; // Dynamic project counts
}

export type SidebarSelection =
  | "inbox"
  | "today"
  | "upcoming"
  | "someday"
  | "logbook"
  | string; // Allow dynamic project IDs

export type TagSelection = "all" | "important" | "today";
