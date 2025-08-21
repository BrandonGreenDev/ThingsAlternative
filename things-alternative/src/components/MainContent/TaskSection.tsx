import React from "react";
import styled from "@emotion/styled";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import TimePicker from "react-time-picker";

interface TaskSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  dueDate: Date;
  dueTime?: string;
  isCompleted?: boolean;
  onDateChange: (newDate: Date) => void;
  onTimeChange?: (newTime: string | undefined) => void;
  onToggleComplete?: () => void;
}

const SectionContainer = styled.div<{ isCompleted?: boolean }>(
  {
    marginBottom: "24px",
    transition: "opacity 0.2s ease",
  },
  (props) => ({
    opacity: props.isCompleted ? 0.6 : 1,
    backgroundColor: props.isCompleted ? "#f9f9f9" : "transparent",
    borderRadius: props.isCompleted ? "8px" : "0",
    padding: props.isCompleted ? "12px" : "0",
  })
);

const SectionHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 0",
});

const TitleSection = styled.div({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    color: "#007AFF",
  },
});

const CompletionCheckbox = styled.input({
  marginRight: "8px",
  cursor: "pointer",
  accentColor: "#007AFF",
});

const DateInput = styled.input({
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  padding: "4px 8px",
  background: "#f5f5f5",
  color: "#333",
  fontSize: "12px",
  marginLeft: "16px",
  height: "28px",
  width: "120px",
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

// Styled wrapper for the TimePicker to match our design
const TimePickerWrapper = styled.div({
  marginLeft: "8px",
  ".react-time-picker": {
    fontSize: "12px",
    height: "28px",
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
    gap: "4px",
    padding: "0",
    background: "white",
  },
  ".react-time-picker__inputGroup__input": {
    background: "#f5f5f5",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    padding: "4px 8px",
    width: "40px !important",
    height: "28px",
    fontSize: "12px",
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
    padding: "0 4px",
  },
  ".react-time-picker__inputGroup__amPm": {
    background: "#f5f5f5",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "12px",
    height: "28px",
    width: "54px",
    marginLeft: "4px",
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

const SectionTitle = styled.h2<{ isCompleted?: boolean }>(
  {
    fontSize: "15px",
    fontWeight: 600,
    color: "inherit",
    margin: 0,
    marginLeft: "8px",
    transition: "text-decoration 0.2s ease",
  },
  (props) => ({
    textDecoration: props.isCompleted ? "line-through" : "none",
  })
);

const TaskList = styled.div({
  marginLeft: "24px",
});

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  dueDate,
  dueTime,
  isCompleted = false,
  onDateChange,
  onTimeChange,
  onToggleComplete,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const formattedDate = dueDate
    ? new Date(dueDate).toISOString().split("T")[0]
    : "";

  // Handle time changes with validation
  const handleTimeChange = (value: string | null) => {
    if (!value) {
      onTimeChange?.(undefined);
      return;
    }
    onTimeChange?.(value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleComplete?.();
  };

  return (
    <SectionContainer isCompleted={isCompleted}>
      <SectionHeader>
        <TitleSection onClick={() => setIsExpanded(!isExpanded)}>
          <CompletionCheckbox
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
          {isExpanded
            ? FiChevronDown({ size: 20 })
            : FiChevronRight({ size: 20 })}
          <SectionTitle isCompleted={isCompleted}>{title}</SectionTitle>
        </TitleSection>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: "16px",
          }}
        >
          <DateInput
            type="date"
            value={formattedDate}
            onChange={(e) => {
              // If no date is selected, use today's date
              const newDate = e.target.value
                ? new Date(e.target.value)
                : new Date();
              onDateChange(newDate);
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <TimePickerWrapper>
            <TimePicker
              value={dueTime || ""}
              onChange={(value: string | null) => handleTimeChange(value)}
              format="h:m a"
              disableClock={true}
              clearIcon={null}
              required={false}
              hourPlaceholder="8"
              minutePlaceholder="10"
              nativeInputAriaLabel="Time"
              locale="en-US"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </TimePickerWrapper>
        </div>
      </SectionHeader>
      {isExpanded && <TaskList>{children}</TaskList>}
    </SectionContainer>
  );
};

export default TaskSection;
