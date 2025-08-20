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

const Sidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState("inbox");

  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarListItem
          icon={FiInbox({ size: 18 })}
          text="Inbox"
          badge={2}
          selected={selectedItem === "inbox"}
          onClick={() => setSelectedItem("inbox")}
        />
        <SidebarListItem
          icon={FiCalendar({ size: 18 })}
          text="Today"
          badge={8}
          selected={selectedItem === "today"}
          onClick={() => setSelectedItem("today")}
        />
        <SidebarListItem
          icon={FiClock({ size: 18 })}
          text="Upcoming"
          selected={selectedItem === "upcoming"}
          onClick={() => setSelectedItem("upcoming")}
        />
        <SidebarListItem
          icon={FiArchive({ size: 18 })}
          text="Someday"
          selected={selectedItem === "someday"}
          onClick={() => setSelectedItem("someday")}
        />
        <SidebarListItem
          icon={FiBook({ size: 18 })}
          text="Logbook"
          selected={selectedItem === "logbook"}
          onClick={() => setSelectedItem("logbook")}
        />
      </SidebarSection>

      <SidebarSection title="Projects">
        <SidebarListItem
          text="Family"
          selected={selectedItem === "family"}
          onClick={() => setSelectedItem("family")}
        />
        <SidebarListItem
          text="Work"
          selected={selectedItem === "work"}
          onClick={() => setSelectedItem("work")}
        />
        <SidebarListItem
          text="Hobbies"
          selected={selectedItem === "hobbies"}
          onClick={() => setSelectedItem("hobbies")}
        />
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
