import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
      main: '#007AFF',
    },
  },
});

// Styled components
const AppContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const SidebarContainer = styled(Box)({
  width: '250px',
  borderRight: '1px solid #E0E0E0',
  height: '100%',
  overflow: 'auto',
  backgroundColor: '#F5F5F5',
});

const MainContentContainer = styled(Box)({
  flex: 1,
  height: '100%',
  overflow: 'auto',
  backgroundColor: '#FFFFFF',
  padding: '20px',
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <SidebarContainer>
          {/* Sidebar component will go here */}
          <Box p={2}>Sidebar Content</Box>
        </SidebarContainer>
        <MainContentContainer>
          {/* Main content component will go here */}
          <Box>Main Content</Box>
        </MainContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
