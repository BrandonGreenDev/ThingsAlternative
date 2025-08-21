import React from "react";
import styled from "@emotion/styled";
import { FiCircle, FiCheckCircle, FiStar, FiMoreHorizontal } from "react-icons/fi";
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
  // Task reassignment props
  sections?: Array<{ id: string; title: string }>;
  currentSectionId?: string;
  onMoveToSection?: (sectionId: string) => void;
}

const Container = styled.div({
  display: "flex",
  alignItems: "flex-start",
  padding: "8px 0",
  "&:hover .task-actions": {
    opacity: 1,
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
  opacity: 0,
  transition: "opacity 0.2s ease",
});

const ActionButton = styled.button({
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  color: "#999",
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  "&:hover": {
    color: "#007AFF",
    background: "#F0F0F0",
  },
});

const DropdownContainer = styled.div({
  position: "relative",
  display: "inline-block",
});

const DropdownMenu = styled.div<{ isVisible: boolean }>({
  position: "absolute",
  right: 0,
  top: "100%",
  backgroundColor: "white",
  border: "1px solid #E0E0E0",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  minWidth: "160px",
  zIndex: 1000,
  maxHeight: "200px",
  overflowY: "auto",
}, (props) => ({
  display: props.isVisible ? "block" : "none",
}));

const DropdownItem = styled.button({
  width: "100%",
  padding: "8px 12px",
  border: "none",
  background: "none",
  textAlign: "left",
  fontSize: "14px",
  color: "#333",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#F0F0F0",
  },
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  },
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
  sections = [],
  currentSectionId,
  onMoveToSection,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);
  
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
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
      <Actions className="task-actions" style={{ opacity: (isHovered || isDropdownOpen) ? 1 : 0 }}>
        <StarButton isStarred={isStarred} onClick={onToggleStar}>
          {FiStar({ size: 16 })}
        </StarButton>
        {sections.length > 1 && onMoveToSection && (
          <DropdownContainer ref={dropdownRef}>
            <ActionButton
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Move to section"
            >
              {FiMoreHorizontal({ size: 16 })}
            </ActionButton>
            <DropdownMenu isVisible={isDropdownOpen}>
              {sections
                .filter(section => section.id !== currentSectionId)
                .map(section => (
                  <DropdownItem
                    key={section.id}
                    onClick={() => {
                      onMoveToSection(section.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Move to {section.title}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </DropdownContainer>
        )}
      </Actions>
    </Container>
  );
};

export default TaskItem;
