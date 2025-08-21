import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Section, Task, SidebarSelection, TagSelection } from "./types";

interface AppContextType {
  // State
  sections: Section[];
  selectedTag: TagSelection;
  selectedSidebar: SidebarSelection;
  newSectionTitle: string;
  isAddingSectionTitle: boolean;

  // Actions
  setSections: (sections: Section[]) => void;
  setSelectedTag: (tag: TagSelection) => void;
  setSelectedSidebar: (sidebar: SidebarSelection) => void;
  setNewSectionTitle: (title: string) => void;
  setIsAddingSectionTitle: (isAdding: boolean) => void;

  // Task operations
  addSection: (title: string) => void;
  addTask: (sectionId: string) => void;
  toggleTaskComplete: (sectionId: string, taskId: string) => void;
  toggleTaskStar: (sectionId: string, taskId: string) => void;
  updateTaskTitle: (
    sectionId: string,
    taskId: string,
    newTitle: string
  ) => void;
  updateTaskDate: (sectionId: string, taskId: string, newDate: Date) => void;
  updateTaskTime: (
    sectionId: string,
    taskId: string,
    newTime: string | undefined
  ) => void;
  updateSectionDate: (sectionId: string, newDate: Date) => void;
  updateSectionTime: (sectionId: string, newTime: string | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize sections from localStorage
  const getInitialSections = (): Section[] => {
    const stored = localStorage.getItem("things_sections");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((section: any) => ({
            ...section,
            dueDate: section.dueDate ? new Date(section.dueDate) : new Date(),
            tasks: Array.isArray(section.tasks)
              ? section.tasks.map((task: any) => ({
                  ...task,
                  dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
                }))
              : [],
          }));
        }
      } catch (e) {
        localStorage.removeItem("things_sections");
      }
    }
    return [];
  };

  // State
  const [sections, setSections] = useState<Section[]>(getInitialSections);
  const [selectedTag, setSelectedTag] = useState<TagSelection>("all");
  const [selectedSidebar, setSelectedSidebar] =
    useState<SidebarSelection>("inbox");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSectionTitle, setIsAddingSectionTitle] = useState(false);

  // Save to localStorage whenever sections change
  useEffect(() => {
    localStorage.setItem("things_sections", JSON.stringify(sections));
  }, [sections]);

  // Reset tag filter when sidebar changes
  useEffect(() => {
    setSelectedTag("all");
  }, [selectedSidebar]);

  // Task operations
  const addSection = (title: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: title.trim(),
      tasks: [],
      dueDate: new Date(),
      dueTime: undefined,
    };
    setSections((prev) => [...prev, newSection]);
    setNewSectionTitle("");
    setIsAddingSectionTitle(false);
  };

  const addTask = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newTask: Task = {
            id: Date.now().toString(),
            title: "",
            isCompleted: false,
            isStarred: false,
            dueDate: section.dueDate, // Inherit section's due date
            dueTime: section.dueTime, // Inherit section's due time
          };
          return { ...section, tasks: [...section.tasks, newTask] };
        }
        return section;
      })
    );
  };

  const toggleTaskComplete = (sectionId: string, taskId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task
              ),
            }
          : section
      )
    );
  };

  const toggleTaskStar = (sectionId: string, taskId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isStarred: !task.isStarred }
                  : task
              ),
            }
          : section
      )
    );
  };

  const updateTaskTitle = (
    sectionId: string,
    taskId: string,
    newTitle: string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle } : task
              ),
            }
          : section
      )
    );
  };

  const updateTaskDate = (
    sectionId: string,
    taskId: string,
    newDate: Date
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, dueDate: newDate } : task
              ),
            }
          : section
      )
    );
  };

  const updateTaskTime = (
    sectionId: string,
    taskId: string,
    newTime: string | undefined
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, dueTime: newTime } : task
              ),
            }
          : section
      )
    );
  };

  const updateSectionDate = (sectionId: string, newDate: Date) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, dueDate: newDate } : section
      )
    );
  };

  const updateSectionTime = (
    sectionId: string,
    newTime: string | undefined
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, dueTime: newTime } : section
      )
    );
  };

  const value: AppContextType = {
    // State
    sections,
    selectedTag,
    selectedSidebar,
    newSectionTitle,
    isAddingSectionTitle,

    // Actions
    setSections,
    setSelectedTag,
    setSelectedSidebar,
    setNewSectionTitle,
    setIsAddingSectionTitle,

    // Task operations
    addSection,
    addTask,
    toggleTaskComplete,
    toggleTaskStar,
    updateTaskTitle,
    updateTaskDate,
    updateTaskTime,
    updateSectionDate,
    updateSectionTime,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
