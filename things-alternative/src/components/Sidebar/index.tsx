import React from "react";
import styled from "@emotion/styled";
import {
  FiInbox,
  FiCalendar,
  FiClock,
  FiArchive,
  FiBook,
} from "react-icons/fi";
import SidebarSection from "./SidebarSection";
import SidebarListItem from "./SidebarListItem";

const SidebarContainer = styled.div({
  padding: "16px 0",
});

interface SidebarProps {
  selectedSidebar: string;
  setSelectedSidebar: (val: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedSidebar,
  setSelectedSidebar,
}) => {
  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarListItem
          icon={FiInbox({ size: 18 })}
          text="Inbox"
          badge={2}
          selected={selectedSidebar === "inbox"}
          onClick={() => setSelectedSidebar("inbox")}
        />
        <SidebarListItem
          icon={FiCalendar({ size: 18 })}
          text="Today"
          badge={8}
          selected={selectedSidebar === "today"}
          onClick={() => setSelectedSidebar("today")}
        />
        <SidebarListItem
          icon={FiClock({ size: 18 })}
          text="Upcoming"
          selected={selectedSidebar === "upcoming"}
          onClick={() => setSelectedSidebar("upcoming")}
        />
        <SidebarListItem
          icon={FiArchive({ size: 18 })}
          text="Someday"
          selected={selectedSidebar === "someday"}
          onClick={() => setSelectedSidebar("someday")}
        />
        <SidebarListItem
          icon={FiBook({ size: 18 })}
          text="Logbook"
          selected={selectedSidebar === "logbook"}
          onClick={() => setSelectedSidebar("logbook")}
        />
      </SidebarSection>

      <SidebarSection title="Projects">
        <SidebarListItem
          text="Family"
          selected={selectedSidebar === "family"}
          onClick={() => setSelectedSidebar("family")}
        />
        <SidebarListItem
          text="Work"
          selected={selectedSidebar === "work"}
          onClick={() => setSelectedSidebar("work")}
        />
        <SidebarListItem
          text="Hobbies"
          selected={selectedSidebar === "hobbies"}
          onClick={() => setSelectedSidebar("hobbies")}
        />
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
