import React from "react";
import styled from "@emotion/styled";
import { FiCircle, FiCheckCircle, FiStar } from "react-icons/fi";

interface TaskItemProps {
  title: string;
  isCompleted?: boolean;
  isStarred?: boolean;
  notes?: string;
  onToggleComplete?: () => void;
  onToggleStar?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

const Container = styled.div({
  display: "flex",
  alignItems: "flex-start",
  padding: "8px 0",
  "&:hover": {
    "& .task-actions": {
      opacity: 1,
    },
  },
});

const Checkbox = styled.button({
  background: "none",
  border: "none",
  padding: "0",
  cursor: "pointer",
  color: "#999",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: "#007AFF",
  },
});

const Content = styled.div({
  marginLeft: "12px",
  flex: 1,
});

const Title = styled.input<{ isCompleted?: boolean }>(({ isCompleted }) => ({
  fontSize: "14px",
  color: isCompleted ? "#999" : "#333",
  textDecoration: isCompleted ? "line-through" : "none",
  border: "none",
  background: "none",
  width: "100%",
  outline: "none",
  padding: 0,
  "&:focus": {
    borderBottom: "1px solid #007AFF",
  },
}));

const Notes = styled.div({
  fontSize: "12px",
  color: "#666",
  marginTop: "4px",
});

const Actions = styled.div({
  display: "flex",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.2s",
});

const StarButton = styled.button<{ isStarred?: boolean }>(({ isStarred }) => ({
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  color: isStarred ? "#FFB800" : "#999",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: isStarred ? "#FFB800" : "#666",
  },
}));

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  isCompleted = false,
  isStarred = false,
  notes,
  onToggleComplete,
  onToggleStar,
  onTitleChange,
}) => {
  return (
    <Container>
      <Checkbox onClick={onToggleComplete}>
        {isCompleted ? FiCheckCircle({ size: 20 }) : FiCircle({ size: 20 })}
      </Checkbox>
      <Content>
        <Title
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Enter task title"
          isCompleted={isCompleted}
        />
        {notes && <Notes>{notes}</Notes>}
      </Content>
      <Actions className="task-actions">
        <StarButton isStarred={isStarred} onClick={onToggleStar}>
          {FiStar({ size: 16 })}
        </StarButton>
      </Actions>
    </Container>
  );
};

export default TaskItem;
