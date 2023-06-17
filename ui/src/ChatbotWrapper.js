import ChatbotHeader from "./ChatbotHeader";
import ChatbotBody from "./ChatbotBody";
import { Row } from "@nextui-org/react";
import ChatbotFooter from "./ChatbotFooter";
import React, { useState, useEffect } from "react";
//change the socket port here for front end
import { io } from "socket.io-client";
const socket = io();
socket.on('connect', function () {
  console.log("socket connected");
});

const chatbotWrapperStyles = {
  width: "30rem",
  height: "34rem",
  backgroundColor: "#EADCF8",
  borderRadius: "15px",
  marginTop: "1rem",
  marginBottom: "0.5rem",
  padding: "0",
  display: "flex",
  flexDirection: "column",

  "@media(max-width: 768px)": {
    width: "100%",
    height: "100%",
    margin: "0",
  },
};

function ChatbotWrapper() {
  const [messages, setMessages] = useState([
    { text: "Hey ✋! Nice to see you here!", position: "left" },
  ]);

  const handleInput = (msg, id) => {
    if (msg !== "") {
      setMessages([...messages, { text: msg, position: "right" }]);
    }
  };

  useEffect(() => {
    let lastMessage = messages[messages.length - 1];
    // if last message is a non-empty question, ask the server
    if (lastMessage.text !== "" && lastMessage.position === "right") {
      console.log(lastMessage)
      socket.emit("clientMessage", lastMessage.text);
    }
    // handle server responses
    socket.on("serverMessage", (data) => {
      console.log(data);
      const tempData = data.split("#");
      if (tempData.length === 1) {
        setMessages([...messages, { text: tempData[0], position: "left" }]);
      } else {
        const tempList = tempData[1].split(",");
        setMessages([
          ...messages,
          { text: tempData[0], list: tempList, position: "left" },
        ]);
      }
    });
  }, [messages]);

  return (
    <Row css={chatbotWrapperStyles}>
      <ChatbotHeader />
      <ChatbotBody messages={messages} />
      <ChatbotFooter handleInput={handleInput} />
    </Row>
  );
}

export default ChatbotWrapper;
