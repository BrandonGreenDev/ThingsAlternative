import React from "react";
import styled from "@emotion/styled";
import MainContent from "./components/MainContent";

// Styled components
const AppContainer = styled.div({
  display: "flex",
  height: "100vh",
  overflow: "hidden",
});

function App() {
  return (
    <AppContainer>
      <MainContent />
    </AppContainer>
  );
}

export default App;
