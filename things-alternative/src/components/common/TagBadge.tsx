import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface TagBadgeProps {
  count: number;
  color?: string;
}

const Badge = styled(Box)(({ color = '#007AFF' }: { color?: string }) => ({
  backgroundColor: color,
  borderRadius: '10px',
  padding: '0 6px',
  minWidth: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const BadgeText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  color: '#FFFFFF',
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
