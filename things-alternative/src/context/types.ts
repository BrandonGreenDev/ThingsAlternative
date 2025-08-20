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
  family: number;
  work: number;
  hobbies: number;
}

export type SidebarSelection =
  | "inbox"
  | "today"
  | "upcoming"
  | "someday"
  | "logbook"
  | "family"
  | "work"
  | "hobbies";

export type TagSelection = "all" | "important" | "today";
