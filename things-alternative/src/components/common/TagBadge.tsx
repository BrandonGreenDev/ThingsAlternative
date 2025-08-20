import React from "react";
import styled from "@emotion/styled";

interface TagBadgeProps {
  count: number;
  color?: string;
}

const Badge = styled.div<{ color?: string }>(({ color = "#007AFF" }) => ({
  backgroundColor: color,
  borderRadius: "10px",
  padding: "0 6px",
  minWidth: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const BadgeText = styled.span({
  fontSize: "12px",
  fontWeight: 500,
  color: "#FFFFFF",
  lineHeight: 1,
});

const TagBadge: React.FC<TagBadgeProps> = ({ count, color }) => {
  if (count <= 0) return null;

  return (
    <Badge color={color}>
      <BadgeText>{count}</BadgeText>
    </Badge>
  );
};

export default TagBadge;
