import React from "react";
import styled from "@emotion/styled";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface TaskSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const SectionContainer = styled.div({
  marginBottom: "24px",
});

const SectionHeader = styled.div({
  display: "flex",
  alignItems: "center",
  padding: "8px 0",
  cursor: "pointer",
  "&:hover": {
    color: "#007AFF",
  },
});

const SectionTitle = styled.h2({
  fontSize: "15px",
  fontWeight: 600,
  color: "inherit",
  margin: 0,
  marginLeft: "8px",
});

const TaskList = styled.div({
  marginLeft: "24px",
});

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <SectionContainer>
      <SectionHeader onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded
          ? FiChevronDown({ size: 20 })
          : FiChevronRight({ size: 20 })}
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>
      {isExpanded && <TaskList>{children}</TaskList>}
    </SectionContainer>
  );
};

export default TaskSection;
