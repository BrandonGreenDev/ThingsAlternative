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
    selectedTag,
    selectedSidebar,
    newSectionTitle,
    isAddingSectionTitle,
    setSelectedTag,
    setSelectedSidebar,
    setNewSectionTitle,
    setIsAddingSectionTitle,
    addSection,
    addTask,
    toggleTaskComplete,
    toggleTaskStar,
    updateTaskTitle,
    updateTaskDate,
    updateTaskTime,
    updateSectionDate,
    updateSectionTime,
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
          return section.tasks.some((task) => task.isCompleted);
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
    let familyCount = 0;
    let workCount = 0;
    let hobbiesCount = 0;

    sections.forEach((section) => {
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

        // Projects - tasks in sections that match project names
        if (section.title.toLowerCase().includes("family")) {
          familyCount++;
        }
        if (section.title.toLowerCase().includes("work")) {
          workCount++;
        }
        if (section.title.toLowerCase().includes("hobbies")) {
          hobbiesCount++;
        }
      });
    });

    return {
      inbox: inboxCount,
      today: todayCount,
      upcoming: upcomingCount,
      someday: somedayCount,
      logbook: logbookCount,
      family: familyCount,
      work: workCount,
      hobbies: hobbiesCount,
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
                return section.tasks.some((task) => task.isCompleted);
              default:
                return section.title
                  .toLowerCase()
                  .includes(selectedSidebar.toLowerCase());
            }
          })
          .map((section) => (
            <TaskSection
              key={section.id}
              title={section.title}
              dueDate={section.dueDate}
              dueTime={section.dueTime}
              onDateChange={(newDate) => updateSectionDate(section.id, newDate)}
              onTimeChange={(newTime) => updateSectionTime(section.id, newTime)}
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
                  if (
                    ["family", "work", "hobbies"].includes(
                      selectedSidebar.toLowerCase()
                    )
                  ) {
                    return true;
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
          <SectionTitleInput
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={handleSectionTitleSubmit}
            placeholder="Section Title"
            autoFocus
          />
        ) : (
          <AddButton onClick={handleAddSection}>+ Add Section</AddButton>
        )}
      </Container>
    </div>
  );
};

export default MainContent;
