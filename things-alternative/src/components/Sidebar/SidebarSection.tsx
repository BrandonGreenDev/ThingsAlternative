import React from "react";
import styled from "@emotion/styled";
import { FiEdit3 } from "react-icons/fi";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  showEditButton?: boolean;
  isEditMode?: boolean;
  onEditToggle?: () => void;
}

const SectionContainer = styled.div({
  marginBottom: "24px",
});

const SectionHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 16px",
  marginBottom: "4px",
});

const SectionTitle = styled.h3({
  color: "#999999",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  margin: 0,
});

const EditButton = styled.button<{ isActive?: boolean }>(({ isActive }) => ({
  background: "none",
  border: "none",
  color: isActive ? "#007AFF" : "#999999",
  cursor: "pointer",
  padding: "2px",
  display: "flex",
  alignItems: "center",
  fontSize: "12px",
  "&:hover": {
    color: "#007AFF",
  },
}));

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  children, 
  showEditButton = false,
  isEditMode = false,
  onEditToggle,
}) => {
  return (
    <SectionContainer>
      {title && (
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          {showEditButton && (
            <EditButton isActive={isEditMode} onClick={onEditToggle}>
              {FiEdit3({ size: 12 })}
            </EditButton>
          )}
        </SectionHeader>
      )}
      {children}
    </SectionContainer>
  );
};

export default SidebarSection;
