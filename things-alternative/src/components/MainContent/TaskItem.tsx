import React from "react";
import styled from "@emotion/styled";
import { FiCircle, FiCheckCircle, FiStar } from "react-icons/fi";
import TimePicker from "react-time-picker";

interface TaskItemProps {
  title: string;
  isCompleted?: boolean;
  isStarred?: boolean;
  notes?: string;
  dueDate?: Date;
  dueTime?: string;
  onToggleComplete?: () => void;
  onToggleStar?: () => void;
  onTitleChange?: (newTitle: string) => void;
  onDateChange?: (newDate: Date) => void;
  onTimeChange?: (newTime: string | undefined) => void;
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
  gap: "8px",
});

const DateTimeContainer = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: "#666",
});

const DateInput = styled.input({
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  padding: "2px 6px",
  background: "#f5f5f5",
  color: "#333",
  fontSize: "11px",
  height: "24px",
  width: "100px",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#007AFF",
  },
  "&:focus": {
    borderColor: "#007AFF",
    outline: "none",
  },
  "&::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
  },
});

const TimePickerWrapper = styled.div({
  ".react-time-picker": {
    fontSize: "11px",
    height: "24px",
    display: "inline-flex",
    alignItems: "center",
  },
  ".react-time-picker__wrapper": {
    display: "inline-flex",
    alignItems: "center",
    border: "none",
    padding: "0",
  },
  ".react-time-picker__inputGroup": {
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    padding: "0",
    background: "none",
  },
  ".react-time-picker__inputGroup__input": {
    background: "#f5f5f5",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    padding: "2px 6px",
    width: "32px !important",
    height: "24px",
    fontSize: "11px",
    textAlign: "center",
    "&:hover": {
      borderColor: "#007AFF",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#007AFF",
    },
  },
  ".react-time-picker__inputGroup__divider": {
    padding: "0 2px",
  },
  ".react-time-picker__inputGroup__amPm": {
    background: "#f5f5f5",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "11px",
    height: "24px",
    width: "44px",
    marginLeft: "2px",
    textAlign: "center",
    appearance: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#007AFF",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#007AFF",
    },
  },
  // Hide all buttons and unnecessary elements
  ".react-time-picker__button, .react-time-picker__clock": {
    display: "none",
  },
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
  dueDate,
  dueTime,
  onToggleComplete,
  onToggleStar,
  onTitleChange,
  onDateChange,
  onTimeChange,
}) => {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onDateChange?.(newDate);
  };

  const handleTimeChange = (value: string | null) => {
    onTimeChange?.(value || undefined);
  };

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
        {dueDate && (
          <DateTimeContainer>
            <DateInput
              type="date"
              value={formatDateForInput(dueDate)}
              onChange={handleDateChange}
            />
            <TimePickerWrapper>
              <TimePicker
                onChange={handleTimeChange}
                value={dueTime}
                disableClock={true}
                clearIcon={null}
                clockIcon={null}
                format="h:mm a"
              />
            </TimePickerWrapper>
          </DateTimeContainer>
        )}
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
