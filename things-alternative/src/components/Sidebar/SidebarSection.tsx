import React from "react";
import styled from "@emotion/styled";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SectionContainer = styled.div({
  marginBottom: "24px",
});

const SectionTitle = styled.h3({
  color: "#999999",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  padding: "0 16px",
  marginBottom: "4px",
  margin: 0,
});

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <SectionContainer>
      {title && <SectionTitle>{title}</SectionTitle>}
      {children}
    </SectionContainer>
  );
};

export default SidebarSection;
