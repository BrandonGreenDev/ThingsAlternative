import React from "react";
import styled from "@emotion/styled";
import TaskSection from "./TaskSection";
import TaskItem from "./TaskItem";
import FilterTag from "./FilterTag";
import Sidebar from "../Sidebar";
import type { IconType } from "react-icons";
import { FiMoreHorizontal } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import { Task, Section } from "../../context/types";

const MoreHorizontal = FiMoreHorizontal as IconType;

const Container = styled.div({
  padding: "20px",
});

const AddButton = styled.button({
  background: "none",
  border: "none",
  color: "#666",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: "#007AFF",
  },
});

const SectionTitleInput = styled.input({
  fontSize: "15px",
  fontWeight: 600,
  padding: "8px",
  border: "none",
  borderBottom: "1px solid #007AFF",
  outline: "none",
  width: "100%",
  maxWidth: "300px",
});

const ProjectSelector = styled.select({
  fontSize: "14px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  outline: "none",
  backgroundColor: "white",
  marginLeft: "8px",
  maxWidth: "200px",
  "&:focus": {
    borderColor: "#007AFF",
  },
});

const SectionInputContainer = styled.div({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
  gap: "8px",
});

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
});

const Title = styled.h1({
  fontSize: "24px",
  fontWeight: 600,
  margin: 0,
});

const OptionsButton = styled.button({
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  color: "#666",
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  "&:hover": {
    background: "#F0F0F0",
  },
});

const TagsContainer = styled.div({
  marginBottom: "32px",
});

const MainContent: React.FC = () => {
  // Get everything from our simple Context
  const {
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
    setSelectedTag,
    setSelectedSidebar,
    setNewSectionTitle,
    setIsAddingSectionTitle,
    setNewProjectName,
    setIsAddingProject,
    setIsEditingProjects,
    setNewSectionProjectId,
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
    addProject,
    deleteProject,
    showConfirmation,
  } = useAppContext();

  const handleAddSection = () => {
    setIsAddingSectionTitle(true);
  };

  const handleSectionTitleSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && newSectionTitle.trim()) {
      addSection(newSectionTitle);
    } else if (e.key === "Escape") {
      setNewSectionTitle("");
      setIsAddingSectionTitle(false);
    }
  };

  const handleAddProject = () => {
    setIsAddingProject(true);
  };

  const handleProjectNameSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && newProjectName.trim()) {
      addProject(newProjectName);
    } else if (e.key === "Escape") {
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditingProjects(!isEditingProjects);
  };

  const handleDeleteProject = (projectId: string) => {
    showConfirmation(
      "Delete Project",
      "Are you sure you want to delete this project? Sections will be unassigned but not deleted.",
      () => {
        deleteProject(projectId);
        // If we're viewing the deleted project, switch to inbox
        if (selectedSidebar === projectId) {
          setSelectedSidebar("inbox");
        }
      },
      {
        confirmText: "Delete",
        cancelText: "Cancel"
      }
    );
  };

  // Helper function to get effective date for a task (task date overrides section date)
  const getEffectiveTaskDate = (task: Task, section: Section): Date => {
    return task.dueDate || section.dueDate;
  };

  // Calculate task counts for filter tags
  const getTaskCounts = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let allTasksCount = 0;
    let importantTasksCount = 0;
    let todayTasksCount = 0;

    // Get sections that match current sidebar filter
    const filteredSections = sections.filter((section) => {
      if (selectedTag === "important") {
        const hasImportantTasks = section.tasks.some((task) => task.isStarred);
        if (!hasImportantTasks) return false;
      }

      switch (selectedSidebar) {
        case "inbox":
          return true;
        case "today": {
          // Check if section or any of its tasks are due today
          const sectionDateStr = section.dueDate.toISOString().split("T")[0];
          const hasTasksDueToday = section.tasks.some((task) => {
            const effectiveDate = getEffectiveTaskDate(task, section);
            const taskDateStr = effectiveDate.toISOString().split("T")[0];
            return taskDateStr === todayStr;
          });
          return sectionDateStr === todayStr || hasTasksDueToday;
        }
        case "upcoming": {
          // Check if section or any of its tasks are due in the future
          const hasUpcomingTasks = section.tasks.some((task) => {
            const effectiveDate = getEffectiveTaskDate(task, section);
            return effectiveDate > today;
          });
          return section.dueDate > today || hasUpcomingTasks;
        }
        case "someday": {
          const somedayThreshold = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          const hasSomedayTasks = section.tasks.some((task) => {
            const effectiveDate = getEffectiveTaskDate(task, section);
            return effectiveDate > somedayThreshold;
          });
          return section.dueDate > somedayThreshold || hasSomedayTasks;
        }
        case "logbook":
          return section.isCompleted || section.tasks.some((task) => task.isCompleted);
        default:
          return section.title
            .toLowerCase()
            .includes(selectedSidebar.toLowerCase());
      }
    });

    // Count tasks within the filtered sections
    filteredSections.forEach((section) => {
      section.tasks.forEach((task) => {
        const effectiveDate = getEffectiveTaskDate(task, section);
        const effectiveDateStr = effectiveDate.toISOString().split("T")[0];
        let includeTask = true;

        if (selectedSidebar === "upcoming" && effectiveDate <= today) {
          includeTask = false;
        }
        if (selectedSidebar === "logbook" && !task.isCompleted) {
          includeTask = false;
        }

        if (includeTask) {
          allTasksCount++;
          if (task.isStarred) {
            importantTasksCount++;
          }
          if (effectiveDateStr === todayStr) {
            todayTasksCount++;
          }
        }
      });
    });

    return {
      all: allTasksCount,
      important: importantTasksCount,
      today: todayTasksCount,
    };
  };

  // Calculate sidebar counts
  const getSidebarCounts = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const somedayThreshold = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    let inboxCount = 0;
    let todayCount = 0;
    let upcomingCount = 0;
    let somedayCount = 0;
    let logbookCount = 0;

    // Initialize project counts
    const projectCounts: { [projectId: string]: number } = {};
    projects.forEach((project) => {
      projectCounts[project.id] = 0;
    });

    sections.forEach((section) => {
      // Count completed sections in logbook
      if (section.isCompleted) {
        logbookCount++;
      }
      
      section.tasks.forEach((task) => {
        const effectiveDate = getEffectiveTaskDate(task, section);
        const effectiveDateStr = effectiveDate.toISOString().split("T")[0];

        // Inbox shows all tasks
        inboxCount++;

        // Today - tasks due today (using effective date)
        if (effectiveDateStr === todayStr) {
          todayCount++;
        }

        // Upcoming - tasks due in the future
        if (effectiveDate > today) {
          upcomingCount++;
        }

        // Someday - tasks due more than 7 days from now
        if (effectiveDate > somedayThreshold) {
          somedayCount++;
        }

        // Logbook - completed tasks
        if (task.isCompleted) {
          logbookCount++;
        }

        // Project counts - count tasks in sections assigned to projects
        if (section.projectId && projectCounts.hasOwnProperty(section.projectId)) {
          projectCounts[section.projectId]++;
        }
      });
    });

    return {
      inbox: inboxCount,
      today: todayCount,
      upcoming: upcomingCount,
      someday: somedayCount,
      logbook: logbookCount,
      ...projectCounts,
    };
  };

  const taskCounts = getTaskCounts();
  const sidebarCounts = getSidebarCounts();

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "280px",
          minWidth: "280px",
          borderRight: "1px solid #E0E0E0",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Sidebar
          selectedSidebar={selectedSidebar}
          setSelectedSidebar={setSelectedSidebar}
          counts={sidebarCounts}
          projects={projects}
          onAddProject={handleAddProject}
          newProjectName={newProjectName}
          isAddingProject={isAddingProject}
          onProjectNameChange={setNewProjectName}
          onProjectNameSubmit={handleProjectNameSubmit}
          isEditingProjects={isEditingProjects}
          onEditToggle={handleEditToggle}
          onDeleteProject={handleDeleteProject}
        />
      </div>
      <Container>
        <Header>
          <Title>Prepare Presentation</Title>
          <OptionsButton>{MoreHorizontal({ size: 20 })}</OptionsButton>
        </Header>

        <TagsContainer>
          <FilterTag
            label="All"
            count={taskCounts.all}
            isSelected={selectedTag === "all"}
            onClick={() => setSelectedTag("all")}
          />
          <FilterTag
            label="Important"
            count={taskCounts.important}
            isSelected={selectedTag === "important"}
            onClick={() => setSelectedTag("important")}
          />
          {selectedSidebar !== "today" && (
            <FilterTag
              label="Today"
              count={taskCounts.today}
              isSelected={selectedTag === "today"}
              onClick={() => setSelectedTag("today")}
            />
          )}
        </TagsContainer>

        {sections
          .filter((section) => {
            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];

            if (selectedTag === "important") {
              const hasImportantTasks = section.tasks.some(
                (task) => task.isStarred
              );
              if (!hasImportantTasks) return false;
            }

            if (selectedTag === "today") {
              // Show section if it has any tasks due today
              const hasTodayTasks = section.tasks.some((task) => {
                const effectiveDate = getEffectiveTaskDate(task, section);
                const effectiveDateStr = effectiveDate.toISOString().split("T")[0];
                return effectiveDateStr === todayStr;
              });
              return hasTodayTasks;
            }

            switch (selectedSidebar) {
              case "inbox":
                return true;
              case "today": {
                // Show section if it or any of its tasks are due today
                const sectionDateStr = section.dueDate.toISOString().split("T")[0];
                const hasTodayTasks = section.tasks.some((task) => {
                  const effectiveDate = getEffectiveTaskDate(task, section);
                  const effectiveDateStr = effectiveDate.toISOString().split("T")[0];
                  return effectiveDateStr === todayStr;
                });
                return sectionDateStr === todayStr || hasTodayTasks;
              }
              case "upcoming": {
                // Show section if it or any of its tasks are due in the future
                const hasUpcomingTasks = section.tasks.some((task) => {
                  const effectiveDate = getEffectiveTaskDate(task, section);
                  return effectiveDate > today;
                });
                return section.dueDate > today || hasUpcomingTasks;
              }
              case "someday": {
                const somedayThreshold = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                const hasSomedayTasks = section.tasks.some((task) => {
                  const effectiveDate = getEffectiveTaskDate(task, section);
                  return effectiveDate > somedayThreshold;
                });
                return section.dueDate > somedayThreshold || hasSomedayTasks;
              }
              case "logbook":
                return section.isCompleted || section.tasks.some((task) => task.isCompleted);
              default:
                // Handle dynamic project selection
                const selectedProject = projects.find(p => p.id === selectedSidebar);
                if (selectedProject) {
                  return section.projectId === selectedProject.id;
                }
                return false;
            }
          })
          .map((section) => (
            <TaskSection
              key={section.id}
              title={section.title}
              dueDate={section.dueDate}
              dueTime={section.dueTime}
              isCompleted={section.isCompleted}
              onDateChange={(newDate) => updateSectionDate(section.id, newDate)}
              onTimeChange={(newTime) => updateSectionTime(section.id, newTime)}
              onToggleComplete={() => toggleSectionComplete(section.id)}
            >
              {section.tasks
                .filter((task) => {
                  const today = new Date();
                  const todayStr = today.toISOString().split("T")[0];
                  const effectiveDate = getEffectiveTaskDate(task, section);
                  const effectiveDateStr = effectiveDate.toISOString().split("T")[0];

                  if (selectedTag === "important" && !task.isStarred) {
                    return false;
                  }
                  if (selectedTag === "today") {
                    return effectiveDateStr === todayStr;
                  }
                  if (selectedTag === "all") {
                    return true;
                  }

                  if (selectedSidebar === "today") {
                    return true; // Already filtered at section level
                  }
                  if (selectedSidebar === "upcoming") {
                    return effectiveDate > today;
                  }
                  if (selectedSidebar === "logbook") {
                    return task.isCompleted;
                  }
                  
                  // Handle dynamic project selection
                  const selectedProject = projects.find(p => p.id === selectedSidebar);
                  if (selectedProject) {
                    return true; // Already filtered at section level
                  }

                  // For inbox and other cases
                  if (selectedSidebar === "inbox") {
                    return true;
                  }

                  return true;
                })
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    title={task.title}
                    isCompleted={task.isCompleted}
                    isStarred={task.isStarred}
                    dueDate={task.dueDate}
                    dueTime={task.dueTime}
                    onToggleComplete={() =>
                      toggleTaskComplete(section.id, task.id)
                    }
                    onToggleStar={() => toggleTaskStar(section.id, task.id)}
                    onTitleChange={(newTitle) =>
                      updateTaskTitle(section.id, task.id, newTitle)
                    }
                    onDateChange={(newDate) =>
                      updateTaskDate(section.id, task.id, newDate)
                    }
                    onTimeChange={(newTime) =>
                      updateTaskTime(section.id, task.id, newTime)
                    }
                  />
                ))}
              <AddButton onClick={() => addTask(section.id)}>
                + Add Task
              </AddButton>
            </TaskSection>
          ))}

        {isAddingSectionTitle ? (
          <SectionInputContainer>
            <SectionTitleInput
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={handleSectionTitleSubmit}
              placeholder="Section Title"
              autoFocus
            />
            <ProjectSelector
              value={newSectionProjectId || ""}
              onChange={(e) => setNewSectionProjectId(e.target.value || undefined)}
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </ProjectSelector>
          </SectionInputContainer>
        ) : (
          <AddButton onClick={handleAddSection}>+ Add Section</AddButton>
        )}
      </Container>
    </div>
  );
};

export default MainContent;
