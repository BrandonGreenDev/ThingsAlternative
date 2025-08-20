import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SectionContainer = styled(Box)({
  marginBottom: '24px',
});

const SectionTitle = styled(Typography)({
  color: '#999999',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  padding: '0 16px',
  marginBottom: '4px',
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
