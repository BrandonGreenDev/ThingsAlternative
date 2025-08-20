import React from "react";
import styled from "@emotion/styled";
import TagBadge from "../common/TagBadge";

interface SidebarListItemProps {
  icon?: React.ReactNode;
  text: string;
  badge?: number;
  selected?: boolean;
  onClick?: () => void;
}

const StyledListItem = styled.div<{ selected?: boolean }>(({ selected }) => ({
  padding: "8px 16px",
  cursor: "pointer",
  backgroundColor: selected ? "rgba(0, 122, 255, 0.1)" : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? "rgba(0, 122, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)",
  },
  borderRadius: "8px",
  margin: "0 8px",
  width: "auto",
  display: "flex",
  alignItems: "center",
}));

const StyledListItemText = styled.span<{ selected?: boolean }>(
  ({ selected }) => ({
    fontSize: "14px",
    fontWeight: selected ? 600 : 400,
    color: selected ? "#007AFF" : "#333333",
    flex: 1,
  })
);

const IconWrapper = styled.div<{ selected?: boolean }>(({ selected }) => ({
  minWidth: "32px",
  color: selected ? "#007AFF" : "#666666",
  display: "flex",
  alignItems: "center",
}));

const SidebarListItem: React.FC<SidebarListItemProps> = ({
  icon,
  text,
  badge,
  selected,
  onClick,
}) => {
  return (
    <StyledListItem selected={selected} onClick={onClick}>
      {icon && <IconWrapper selected={selected}>{icon}</IconWrapper>}
      <StyledListItemText selected={selected}>{text}</StyledListItemText>
      {badge !== undefined && <TagBadge count={badge} />}
    </StyledListItem>
  );
};

export default SidebarListItem;
