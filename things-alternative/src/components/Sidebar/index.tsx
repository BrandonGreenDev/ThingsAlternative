import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import TodayIcon from '@mui/icons-material/Today';
import UpcomingIcon from '@mui/icons-material/Event';
import SomedayIcon from '@mui/icons-material/Archive';
import LogbookIcon from '@mui/icons-material/Book';
import SidebarSection from './SidebarSection';
import SidebarListItem from './SidebarListItem';

const SidebarContainer = styled(Box)({
  padding: '16px 0',
});

const Sidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState('inbox');

  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarListItem
          icon={<InboxIcon />}
          text="Inbox"
          badge={2}
          selected={selectedItem === 'inbox'}
          onClick={() => setSelectedItem('inbox')}
        />
        <SidebarListItem
          icon={<TodayIcon />}
          text="Today"
          badge={8}
          selected={selectedItem === 'today'}
          onClick={() => setSelectedItem('today')}
        />
        <SidebarListItem
          icon={<UpcomingIcon />}
          text="Upcoming"
          selected={selectedItem === 'upcoming'}
          onClick={() => setSelectedItem('upcoming')}
        />
        <SidebarListItem
          icon={<SomedayIcon />}
          text="Someday"
          selected={selectedItem === 'someday'}
          onClick={() => setSelectedItem('someday')}
        />
        <SidebarListItem
          icon={<LogbookIcon />}
          text="Logbook"
          selected={selectedItem === 'logbook'}
          onClick={() => setSelectedItem('logbook')}
        />
      </SidebarSection>

      <SidebarSection title="Projects">
        <SidebarListItem
          text="Family"
          selected={selectedItem === 'family'}
          onClick={() => setSelectedItem('family')}
        />
        <SidebarListItem
          text="Work"
          selected={selectedItem === 'work'}
          onClick={() => setSelectedItem('work')}
        />
        <SidebarListItem
          text="Hobbies"
          selected={selectedItem === 'hobbies'}
          onClick={() => setSelectedItem('hobbies')}
        />
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
