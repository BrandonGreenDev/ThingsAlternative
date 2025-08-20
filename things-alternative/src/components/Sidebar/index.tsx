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
  counts: {
    inbox: number;
    today: number;
    upcoming: number;
    someday: number;
    logbook: number;
    family: number;
    work: number;
    hobbies: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedSidebar,
  setSelectedSidebar,
  counts,
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

      <SidebarSection title="Projects">
        <SidebarListItem
          text="Family"
          badge={counts.family > 0 ? counts.family : undefined}
          selected={selectedSidebar === "family"}
          onClick={() => setSelectedSidebar("family")}
        />
        <SidebarListItem
          text="Work"
          badge={counts.work > 0 ? counts.work : undefined}
          selected={selectedSidebar === "work"}
          onClick={() => setSelectedSidebar("work")}
        />
        <SidebarListItem
          text="Hobbies"
          badge={counts.hobbies > 0 ? counts.hobbies : undefined}
          selected={selectedSidebar === "hobbies"}
          onClick={() => setSelectedSidebar("hobbies")}
        />
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
