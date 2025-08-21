import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Section, Task, Project, SidebarSelection, TagSelection } from "./types";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmationWidget from "../components/common/ConfirmationWidget";

interface AppContextType {
  // State
  sections: Section[];
  projects: Project[];
  selectedTag: TagSelection;
  selectedSidebar: SidebarSelection;
  newSectionTitle: string;
  isAddingSectionTitle: boolean;
  newSectionProjectId: string | undefined;
  newProjectName: string;
  isAddingProject: boolean;
  isEditingProjects: boolean;

  // Actions
  setSections: (sections: Section[]) => void;
  setProjects: (projects: Project[]) => void;
  setSelectedTag: (tag: TagSelection) => void;
  setSelectedSidebar: (sidebar: SidebarSelection) => void;
  setNewSectionTitle: (title: string) => void;
  setIsAddingSectionTitle: (isAdding: boolean) => void;
  setNewSectionProjectId: (projectId: string | undefined) => void;
  setNewProjectName: (name: string) => void;
  setIsAddingProject: (isAdding: boolean) => void;
  setIsEditingProjects: (isEditing: boolean) => void;

  // Task operations
  addSection: (title: string, projectId?: string) => void;
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
  toggleSectionComplete: (sectionId: string) => void;
  moveTaskToSection: (taskId: string, fromSectionId: string, toSectionId: string) => void;
  moveSectionToProject: (sectionId: string, projectId: string | undefined) => void;

  // Project operations
  addProject: (name: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  assignSectionToProject: (sectionId: string, projectId: string | undefined) => void;
  
  // Confirmation operations
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string }
  ) => void;
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

  // Initialize projects from localStorage with default projects
  const getInitialProjects = (): Project[] => {
    const stored = localStorage.getItem("things_projects");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        localStorage.removeItem("things_projects");
      }
    }
    // Default projects for backward compatibility
    return [
      { id: "family", name: "Family" },
      { id: "work", name: "Work" },
      { id: "hobbies", name: "Hobbies" },
    ];
  };

  // State
  const [sections, setSections] = useState<Section[]>(getInitialSections);
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [selectedTag, setSelectedTag] = useState<TagSelection>("all");
  const [selectedSidebar, setSelectedSidebar] =
    useState<SidebarSelection>("inbox");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSectionTitle, setIsAddingSectionTitle] = useState(false);
  const [newSectionProjectId, setNewSectionProjectId] = useState<string | undefined>(undefined);
  const [newProjectName, setNewProjectName] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProjects, setIsEditingProjects] = useState(false);

  // Confirmation hook
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  // Save to localStorage whenever sections change
  useEffect(() => {
    localStorage.setItem("things_sections", JSON.stringify(sections));
  }, [sections]);

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("things_projects", JSON.stringify(projects));
  }, [projects]);

  // Reset tag filter when sidebar changes
  useEffect(() => {
    setSelectedTag("all");
  }, [selectedSidebar]);

  // Task operations
  const addSection = (title: string, projectId?: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: title.trim(),
      tasks: [],
      dueDate: new Date(),
      dueTime: undefined,
      projectId: projectId || newSectionProjectId,
    };
    setSections((prev) => [...prev, newSection]);
    setNewSectionTitle("");
    setNewSectionProjectId(undefined);
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
      prev.map((section) => {
        if (section.id === sectionId) {
          const updatedTasks = section.tasks.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          );
          
          const updatedSection = { ...section, tasks: updatedTasks };
          
          // Check if all tasks are now completed and section is not completed
          const allTasksCompleted = updatedTasks.every(task => task.isCompleted);
          const hasTasksToComplete = updatedTasks.length > 0;
          
          if (allTasksCompleted && hasTasksToComplete && !section.isCompleted) {
            showConfirmation(
              "All Tasks Complete!",
              "Mark section as done?",
              () => {
                setSections((prev) =>
                  prev.map((s) =>
                    s.id === sectionId ? { ...s, isCompleted: true } : s
                  )
                );
              },
              {
                confirmText: "Mark Done",
                cancelText: "Keep Open"
              }
            );
          }
          
          return updatedSection;
        }
        return section;
      })
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

  const toggleSectionComplete = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newCompletionState = !section.isCompleted;
          
          // If marking section as complete and there are incomplete tasks, ask user
          if (newCompletionState && section.tasks.some(task => !task.isCompleted)) {
            showConfirmation(
              "Complete Section",
              "Complete all tasks in this section?",
              () => {
                setSections((prev) =>
                  prev.map((s) =>
                    s.id === sectionId
                      ? {
                          ...s,
                          isCompleted: true,
                          tasks: s.tasks.map(task => ({ ...task, isCompleted: true }))
                        }
                      : s
                  )
                );
              },
              {
                confirmText: "Complete All",
                cancelText: "Section Only"
              }
            );
            
            // For now, just complete the section without tasks if user cancels
            return { ...section, isCompleted: newCompletionState };
          }
          
          return { ...section, isCompleted: newCompletionState };
        }
        return section;
      })
    );
  };

  const moveTaskToSection = (taskId: string, fromSectionId: string, toSectionId: string) => {
    setSections((prev) => {
      // Find the task to move
      let taskToMove: Task | null = null;
      
      // Remove task from source section and find the task
      const updatedSections = prev.map((section) => {
        if (section.id === fromSectionId) {
          const taskIndex = section.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = section.tasks[taskIndex];
            return {
              ...section,
              tasks: section.tasks.filter(task => task.id !== taskId)
            };
          }
        }
        return section;
      });
      
      // Add task to destination section
      if (taskToMove) {
        return updatedSections.map((section) => {
          if (section.id === toSectionId) {
            return {
              ...section,
              tasks: [...section.tasks, taskToMove as Task]
            };
          }
          return section;
        });
      }
      
      return updatedSections;
    });
  };

  const moveSectionToProject = (sectionId: string, projectId: string | undefined) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, projectId }
          : section
      )
    );
  };

  // Project operations
  const addProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    setProjects((prev) => [...prev, newProject]);
    setNewProjectName("");
    setIsAddingProject(false);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    // Remove project
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    // Remove project association from sections
    setSections((prev) =>
      prev.map((section) =>
        section.projectId === projectId
          ? { ...section, projectId: undefined }
          : section
      )
    );
  };

  const assignSectionToProject = (
    sectionId: string,
    projectId: string | undefined
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, projectId } : section
      )
    );
  };

  const value: AppContextType = {
    // State
    sections,
    projects,
    selectedTag,
    selectedSidebar,
    newSectionTitle,
    isAddingSectionTitle,
    newProjectName,
    isAddingProject,
    isEditingProjects,
    newSectionProjectId,

    // Actions
    setSections,
    setProjects,
    setSelectedTag,
    setSelectedSidebar,
    setNewSectionTitle,
    setIsAddingSectionTitle,
    setNewProjectName,
    setIsAddingProject,
    setIsEditingProjects,
    setNewSectionProjectId,

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
    toggleSectionComplete,
    moveTaskToSection,
    moveSectionToProject,

    // Project operations
    addProject,
    updateProject,
    deleteProject,
    assignSectionToProject,
    
    // Confirmation operations
    showConfirmation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <ConfirmationWidget
        isVisible={confirmation.isVisible}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        onConfirm={handleConfirm}
        onCancel={hideConfirmation}
      />
    </AppContext.Provider>
  );
};
