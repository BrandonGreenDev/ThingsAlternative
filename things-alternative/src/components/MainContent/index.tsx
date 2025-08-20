import React from "react";
import styled from "@emotion/styled";
import TaskSection from "./TaskSection";
import TaskItem from "./TaskItem";
import FilterTag from "./FilterTag";
import { FiMoreHorizontal } from "react-icons/fi";

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
}

interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

const MainContent: React.FC = () => {
  const [selectedTag, setSelectedTag] = React.useState("all");
  const [sections, setSections] = React.useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = React.useState("");
  const [isAddingSectionTitle, setIsAddingSectionTitle] = React.useState(false);

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
        },
      ]);
      setNewSectionTitle("");
      setIsAddingSectionTitle(false);
    } else if (e.key === "Escape") {
      setNewSectionTitle("");
      setIsAddingSectionTitle(false);
    }
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
              },
            ],
          };
        }
        return section;
      })
    );
  };

  const handleTaskComplete = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: section.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, isCompleted: !task.isCompleted };
              }
              return task;
            }),
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
            tasks: section.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, title: newTitle };
              }
              return task;
            }),
          };
        }
        return section;
      })
    );
  };

  return (
    <Container>
      <Header>
        <Title>Prepare Presentation</Title>
        <OptionsButton>{FiMoreHorizontal({ size: 20 })}</OptionsButton>
      </Header>

      <TagsContainer>
        <FilterTag
          label="All"
          count={8}
          isSelected={selectedTag === "all"}
          onClick={() => setSelectedTag("all")}
        />
        <FilterTag
          label="Important"
          count={3}
          isSelected={selectedTag === "important"}
          onClick={() => setSelectedTag("important")}
        />
        <FilterTag
          label="Diane"
          count={2}
          isSelected={selectedTag === "diane"}
          onClick={() => setSelectedTag("diane")}
        />
      </TagsContainer>

      {sections.map((section) => (
        <TaskSection key={section.id} title={section.title}>
          {section.tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              isCompleted={task.isCompleted}
              isStarred={task.isStarred}
              onToggleComplete={() => handleTaskComplete(section.id, task.id)}
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
  );
};

export default MainContent;
