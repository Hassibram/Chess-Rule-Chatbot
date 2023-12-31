import React from "react";
import Title from "./Title";
import ChatbotWrapper from "./ChatbotWrapper";
import { Container } from "@nextui-org/react";

const mainWrapperStyle = {
  minWidth: "100%",
  width: "100% auto",
  height: "100% auto",
  minHeight: "100vh",
  backgroundColor: "#EDF5FF",
  padding: "1rem",
  margin: "0",
  display: "flex",
  justifyContent: "center",
  "@media(max-width: 768px)": {
    width: "100%",
    padding: "0",
  },
};

function MainWrapper() {
  return (
    <Container css={mainWrapperStyle}>
      <Title />
      <ChatbotWrapper />
    </Container>
  );
}

export default MainWrapper;
