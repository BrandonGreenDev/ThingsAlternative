import React from 'react';
import { styled } from '@mui/material/styles';
import { ListItem as MuiListItem, ListItemIcon, ListItemText } from '@mui/material';
import TagBadge from '../common/TagBadge';

interface SidebarListItemProps {
  icon?: React.ReactNode;
  text: string;
  badge?: number;
  selected?: boolean;
  onClick?: () => void;
}

const StyledListItem = styled(MuiListItem)<{ selected?: boolean }>(({ selected }) => ({
  padding: '8px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
  },
  borderRadius: '8px',
  margin: '0 8px',
  width: 'auto',
}));

const StyledListItemText = styled(ListItemText)<{ selected?: boolean }>(({ selected }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    fontWeight: selected ? 600 : 400,
    color: selected ? '#007AFF' : '#333333',
  },
}));

const IconWrapper = styled(ListItemIcon)<{ selected?: boolean }>(({ selected }) => ({
  minWidth: '32px',
  color: selected ? '#007AFF' : '#666666',
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
      <StyledListItemText selected={selected} primary={text} />
      {badge !== undefined && <TagBadge count={badge} />}
    </StyledListItem>
  );
};

export default SidebarListItem;
