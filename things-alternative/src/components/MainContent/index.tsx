import React from "react";
import styled from "@emotion/styled";
import TaskSection from "./TaskSection";
import TaskItem from "./TaskItem";
import FilterTag from "./FilterTag";
import Sidebar from "../Sidebar";
import type { IconType } from "react-icons";
import { FiMoreHorizontal } from "react-icons/fi";

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

interface Task {
  id: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  isStarred: boolean;
  dueDate: Date;
  dueTime?: string;
}

interface Section {
  id: string;
  title: string;
  tasks: Task[];
  dueDate: Date;
  dueTime?: string;
}

const MainContent: React.FC = () => {
  const [selectedTag, setSelectedTag] = React.useState("all");
  const [selectedSidebar, setSelectedSidebar] = React.useState("inbox");

  // Reset tag filter to "all" when sidebar changes
  React.useEffect(() => {
    setSelectedTag("all");
  }, [selectedSidebar]);

  function getInitialSections(): Section[] {
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
  }

  const [sections, setSections] = React.useState<Section[]>(
    getInitialSections()
  );
  const [newSectionTitle, setNewSectionTitle] = React.useState("");
  const [isAddingSectionTitle, setIsAddingSectionTitle] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("things_sections", JSON.stringify(sections));
  }, [sections]);

  const handleAddSection = () => {
    setIsAddingSectionTitle(true);
  };

  const handleSectionTitleSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && newSectionTitle.trim()) {
      setSections([
        ...sections,
        {
          id: Date.now().toString(),
          title: newSectionTitle.trim(),
          tasks: [],
          dueDate: new Date(),
          dueTime: undefined,
        },
      ]);
      setNewSectionTitle("");
      setIsAddingSectionTitle(false);
    } else if (e.key === "Escape") {
      setNewSectionTitle("");
      setIsAddingSectionTitle(false);
    }
  };

  const handleTaskComplete = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: section.tasks.map((task) =>
              task.id === taskId
                ? { ...task, isCompleted: !task.isCompleted }
                : task
            ),
          };
        }
        return section;
      })
    );
  };

  const handleTaskTitleChange = (
    sectionId: string,
    taskId: string,
    newTitle: string
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: section.tasks.map((task) =>
              task.id === taskId ? { ...task, title: newTitle } : task
            ),
          };
        }
        return section;
      })
    );
  };

  const handleToggleStar = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: section.tasks.map((task) =>
              task.id === taskId
                ? { ...task, isStarred: !task.isStarred }
                : task
            ),
          };
        }
        return section;
      })
    );
  };

  const handleSectionDateChange = (sectionId: string, newDate: Date) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            dueDate: newDate,
          };
        }
        return section;
      })
    );
  };

  const handleSectionTimeChange = (
    sectionId: string,
    newTime: string | undefined
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            dueTime: newTime,
          };
        }
        return section;
      })
    );
  };

  const handleAddTask = (sectionId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: [
              ...section.tasks,
              {
                id: Date.now().toString(),
                title: "",
                isCompleted: false,
                isStarred: false,
                dueDate: new Date(),
                dueTime: undefined,
              },
            ],
          };
        }
        return section;
      })
    );
  };

  // Calculate dynamic counts for filter tags based on current sidebar selection
  const getTaskCounts = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let allTasksCount = 0;
    let importantTasksCount = 0;
    let todayTasksCount = 0;

    // Get sections that match current sidebar filter
    const filteredSections = sections.filter((section) => {
      // If "important" tag filter is selected, only show sections with starred tasks
      if (selectedTag === "important") {
        const hasImportantTasks = section.tasks.some((task) => task.isStarred);
        if (!hasImportantTasks) return false;
      }

      switch (selectedSidebar) {
        case "inbox":
          return true;
        case "today": {
          const sectionDateStr = section.dueDate.toISOString().split("T")[0];
          return sectionDateStr === todayStr;
        }
        case "upcoming":
          return section.dueDate > today;
        case "someday":
          return (
            section.dueDate >
            new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          );
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
      const sectionDateStr = section.dueDate.toISOString().split("T")[0];

      section.tasks.forEach((task) => {
        // Apply additional filtering based on sidebar context
        let includeTask = true;

        if (selectedSidebar === "upcoming" && task.dueDate <= today) {
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
          // Count tasks that are in sections due today
          if (sectionDateStr === todayStr) {
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

  const taskCounts = getTaskCounts();

  // Calculate counts for sidebar sections
  const getSidebarCounts = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let inboxCount = 0;
    let todayCount = 0;
    let upcomingCount = 0;
    let somedayCount = 0;
    let logbookCount = 0;
    let familyCount = 0;
    let workCount = 0;
    let hobbiesCount = 0;

    sections.forEach((section) => {
      const sectionDateStr = section.dueDate.toISOString().split("T")[0];
      const taskCount = section.tasks.length;

      // Inbox shows all sections
      inboxCount += taskCount;

      // Today - sections due today
      if (sectionDateStr === todayStr) {
        todayCount += taskCount;
      }

      // Upcoming - sections due in the future
      if (section.dueDate > today) {
        upcomingCount += taskCount;
      }

      // Someday - sections due more than 7 days from now
      if (
        section.dueDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        somedayCount += taskCount;
      }

      // Logbook - sections with completed tasks
      const completedTasks = section.tasks.filter(
        (task) => task.isCompleted
      ).length;
      if (completedTasks > 0) {
        logbookCount += completedTasks;
      }

      // Projects - sections that match project names
      if (section.title.toLowerCase().includes("family")) {
        familyCount += taskCount;
      }
      if (section.title.toLowerCase().includes("work")) {
        workCount += taskCount;
      }
      if (section.title.toLowerCase().includes("hobbies")) {
        hobbiesCount += taskCount;
      }
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
          {/* Only show Today filter when not already in Today sidebar section */}
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
            const allowTodayTasks =
              selectedSidebar === "today" || selectedSidebar === "inbox";

            // If "important" tag filter is selected, only show sections with starred tasks
            if (selectedTag === "important") {
              const hasImportantTasks = section.tasks.some(
                (task) => task.isStarred
              );
              if (!hasImportantTasks) return false;
            }

            // If "today" tag filter is selected, only show sections due today
            if (selectedTag === "today") {
              const sectionDateStr = section.dueDate
                .toISOString()
                .split("T")[0];
              return sectionDateStr === todayStr;
            }

            switch (selectedSidebar) {
              case "inbox":
                return true;
              case "today": {
                // Only show sections that have a due date of today
                const sectionDateStr = section.dueDate
                  .toISOString()
                  .split("T")[0];
                return sectionDateStr === todayStr;
              }
              case "upcoming":
                return section.dueDate > today;
              case "someday":
                return (
                  section.dueDate >
                  new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                );
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
              onDateChange={(newDate) =>
                handleSectionDateChange(section.id, newDate)
              }
              onTimeChange={(newTime) =>
                handleSectionTimeChange(section.id, newTime)
              }
            >
              {section.tasks
                .filter((task) => {
                  const today = new Date();
                  const todayStr = today.toISOString().split("T")[0];
                  const taskDateStr = task.dueDate.toISOString().split("T")[0];

                  // Apply tag filtering first
                  if (selectedTag === "important" && !task.isStarred) {
                    return false;
                  }
                  if (selectedTag === "today") {
                    return taskDateStr === todayStr;
                  }
                  if (selectedTag === "all") {
                    return true; // Show all tasks when "All" filter is selected
                  }

                  // Apply sidebar filtering for tasks
                  if (selectedSidebar === "today") {
                    // When "Today" is selected in sidebar, show all tasks in sections that are due today
                    // The section filtering already ensures only today's sections are shown
                    return true;
                  }
                  if (selectedSidebar === "upcoming") {
                    return task.dueDate > today;
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

                  // For inbox and other cases, apply the original today task filtering
                  if (selectedSidebar === "inbox") {
                    return true; // Show all tasks in inbox
                  }

                  return true;
                })
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    title={task.title}
                    isCompleted={task.isCompleted}
                    isStarred={task.isStarred}
                    onToggleComplete={() =>
                      handleTaskComplete(section.id, task.id)
                    }
                    onToggleStar={() => handleToggleStar(section.id, task.id)}
                    onTitleChange={(newTitle) =>
                      handleTaskTitleChange(section.id, task.id, newTitle)
                    }
                  />
                ))}
              <AddButton onClick={() => handleAddTask(section.id)}>
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
