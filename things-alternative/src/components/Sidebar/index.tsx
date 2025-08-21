import React from "react";
import styled from "@emotion/styled";
import {
  FiInbox,
  FiCalendar,
  FiClock,
  FiArchive,
  FiBook,
  FiPlus,
} from "react-icons/fi";
import SidebarSection from "./SidebarSection";
import SidebarListItem from "./SidebarListItem";
import { SidebarSelection, SidebarCounts, Project } from "../../context/types";

const SidebarContainer = styled.div({
  padding: "16px 0",
});

const AddProjectButton = styled.button({
  background: "none",
  border: "none",
  color: "#999",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  width: "100%",
  textAlign: "left",
  "&:hover": {
    color: "#007AFF",
    background: "#F0F0F0",
  },
});

const ProjectNameInput = styled.input({
  fontSize: "14px",
  fontWeight: 500,
  padding: "8px 16px",
  margin: "0",
  border: "none",
  borderBottom: "1px solid #007AFF",
  outline: "none",
  width: "calc(100% - 32px)", // Account for padding
  maxWidth: "100%",
  background: "transparent",
  boxSizing: "border-box",
});

interface SidebarProps {
  selectedSidebar: SidebarSelection;
  setSelectedSidebar: (val: SidebarSelection) => void;
  counts: SidebarCounts;
  projects: Project[];
  onAddProject: () => void;
  newProjectName: string;
  isAddingProject: boolean;
  onProjectNameChange: (name: string) => void;
  onProjectNameSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isEditingProjects: boolean;
  onEditToggle: () => void;
  onDeleteProject: (projectId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedSidebar,
  setSelectedSidebar,
  counts,
  projects,
  onAddProject,
  newProjectName,
  isAddingProject,
  onProjectNameChange,
  onProjectNameSubmit,
  isEditingProjects,
  onEditToggle,
  onDeleteProject,
}) => {
  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarListItem
          icon={FiInbox({ size: 18 })}
          text="Inbox"
          badge={counts.inbox}
          selected={selectedSidebar === "inbox"}
          onClick={() => setSelectedSidebar("inbox")}
        />
        <SidebarListItem
          icon={FiCalendar({ size: 18 })}
          text="Today"
          badge={counts.today}
          selected={selectedSidebar === "today"}
          onClick={() => setSelectedSidebar("today")}
        />
        <SidebarListItem
          icon={FiClock({ size: 18 })}
          text="Upcoming"
          badge={counts.upcoming > 0 ? counts.upcoming : undefined}
          selected={selectedSidebar === "upcoming"}
          onClick={() => setSelectedSidebar("upcoming")}
        />
        <SidebarListItem
          icon={FiArchive({ size: 18 })}
          text="Someday"
          badge={counts.someday > 0 ? counts.someday : undefined}
          selected={selectedSidebar === "someday"}
          onClick={() => setSelectedSidebar("someday")}
        />
        <SidebarListItem
          icon={FiBook({ size: 18 })}
          text="Logbook"
          badge={counts.logbook > 0 ? counts.logbook : undefined}
          selected={selectedSidebar === "logbook"}
          onClick={() => setSelectedSidebar("logbook")}
        />
      </SidebarSection>

      <SidebarSection 
        title="Projects" 
        showEditButton={true}
        isEditMode={isEditingProjects}
        onEditToggle={onEditToggle}
      >
        {projects.map((project) => (
          <SidebarListItem
            key={project.id}
            text={project.name}
            badge={counts[project.id] > 0 ? counts[project.id] : undefined}
            selected={selectedSidebar === project.id}
            onClick={() => setSelectedSidebar(project.id)}
            showDeleteButton={isEditingProjects}
            onDelete={() => onDeleteProject(project.id)}
          />
        ))}
        {isAddingProject ? (
          <ProjectNameInput
            type="text"
            value={newProjectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            onKeyDown={onProjectNameSubmit}
            placeholder="Project Name"
            autoFocus
          />
        ) : (
          <AddProjectButton onClick={onAddProject}>
            {FiPlus({ size: 14 })}
            Add Project
          </AddProjectButton>
        )}
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
