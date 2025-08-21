import React from "react";
import styled from "@emotion/styled";
import { FiX } from "react-icons/fi";
import TagBadge from "../common/TagBadge";

interface SidebarListItemProps {
  icon?: React.ReactNode;
  text: string;
  badge?: number;
  selected?: boolean;
  onClick?: () => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
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
  alignItems: "flex-start", // Changed from center to flex-start for multi-line text
  minHeight: "32px", // Ensure minimum height for single-line items
}));

const StyledListItemText = styled.span<{ selected?: boolean }>(
  ({ selected }) => ({
    fontSize: "14px",
    fontWeight: selected ? 600 : 400,
    color: selected ? "#007AFF" : "#333333",
    flex: 1,
    wordWrap: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
    lineHeight: "1.4",
    paddingTop: "2px", // Small adjustment for vertical alignment
  })
);

const IconWrapper = styled.div<{ selected?: boolean }>(({ selected }) => ({
  minWidth: "32px",
  color: selected ? "#007AFF" : "#666666",
  display: "flex",
  alignItems: "center",
  paddingTop: "2px", // Small adjustment to align with text when text wraps
}));

const DeleteButton = styled.button({
  background: "none",
  border: "none",
  color: "#ff3b30",
  cursor: "pointer",
  padding: "4px",
  marginLeft: "4px",
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
});

const SidebarListItem: React.FC<SidebarListItemProps> = ({
  icon,
  text,
  badge,
  selected,
  onClick,
  showDeleteButton = false,
  onDelete,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the item click
    onDelete?.();
  };

  return (
    <StyledListItem selected={selected} onClick={onClick}>
      {icon && <IconWrapper selected={selected}>{icon}</IconWrapper>}
      <StyledListItemText selected={selected}>{text}</StyledListItemText>
      {badge !== undefined && <TagBadge count={badge} />}
      {showDeleteButton && (
        <DeleteButton onClick={handleDeleteClick}>
          {FiX({ size: 14 })}
        </DeleteButton>
      )}
    </StyledListItem>
  );
};

export default SidebarListItem;
