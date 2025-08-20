import React from "react";
import styled from "@emotion/styled";

interface FilterTagProps {
  label: string;
  isSelected?: boolean;
  count?: number;
  onClick?: () => void;
}

const Tag = styled.button<{ isSelected?: boolean }>(({ isSelected }) => ({
  background: isSelected ? "#007AFF" : "#F0F0F0",
  color: isSelected ? "#FFFFFF" : "#666666",
  border: "none",
  borderRadius: "15px",
  padding: "4px 12px",
  fontSize: "13px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  marginRight: "8px",
  "&:hover": {
    background: isSelected ? "#007AFF" : "#E0E0E0",
  },
}));

const Count = styled.span<{ isSelected?: boolean }>(({ isSelected }) => ({
  background: isSelected ? "rgba(255, 255, 255, 0.2)" : "#FFFFFF",
  color: isSelected ? "#FFFFFF" : "#666666",
  borderRadius: "10px",
  padding: "0 6px",
  fontSize: "12px",
  marginLeft: "6px",
}));

const FilterTag: React.FC<FilterTagProps> = ({
  label,
  isSelected = false,
  count,
  onClick,
}) => {
  return (
    <Tag isSelected={isSelected} onClick={onClick}>
      {label}
      {count !== undefined && <Count isSelected={isSelected}>{count}</Count>}
    </Tag>
  );
};

export default FilterTag;
