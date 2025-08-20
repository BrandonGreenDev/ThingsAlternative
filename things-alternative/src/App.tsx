import React from "react";
import styled from "@emotion/styled";
import MainContent from "./components/MainContent";
import { AppProvider } from "./context/AppContext";

// Styled components
const AppContainer = styled.div({
  display: "flex",
  height: "100vh",
  overflow: "hidden",
});

function App() {
  return (
    <AppProvider>
      <AppContainer>
        <MainContent />
      </AppContainer>
    </AppProvider>
  );
}

export default App;
