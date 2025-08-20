import React from "react";
import styled from "@emotion/styled";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

// Styled components
const AppContainer = styled.div({
  display: "flex",
  height: "100vh",
  overflow: "hidden",
});

const SidebarContainer = styled.div({
  width: "250px",
  borderRight: "1px solid #E0E0E0",
  height: "100%",
  overflow: "auto",
  backgroundColor: "#F5F5F5",
});

const MainContentContainer = styled.div({
  flex: 1,
  height: "100%",
  overflow: "auto",
  backgroundColor: "#FFFFFF",
});

function App() {
  return (
    <AppContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContentContainer>
        <MainContent />
      </MainContentContainer>
    </AppContainer>
  );
}

export default App;
