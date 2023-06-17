import React, { useState, useEffect, useRef } from "react";
import { Row } from "@nextui-org/react";
import * as S from "./style";

function ChatbotBody({ messages }) {
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Update chat history when messages prop changes
    if (messages && messages.length > 0) {
      setChatHistory(messages);
      scrollToBottom();
    }
  }, [messages]);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    // Auto-scroll to the bottom of the chat history whenever new messages are added
    scrollToBottom();
  }, [chatHistory]);

  

  return (
    <Row css={S.chatbotBodyStyles}>
      {chatHistory && chatHistory.length > 0 ? (
        chatHistory.map((msg) => (
          <>
            <Row
              css={{
                display: "flex",
                marginBottom: "0.5rem",
                marginTop: "0.5rem",
                height: "auto",
              }}
              className={msg.position}
              key={msg.id} // Assuming each message has a unique "id" property
            >
              <Row
                css={{
                  padding: "0.5rem 0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "50%",
                  fontSize: "1.5rem",
                  color: "white",
                }}
              >
                <span id="input" key={"input"}>
                  {msg.text}
                </span>
              </Row>
            </Row>
            <Row
              css={{
                display: "flex",
                marginBottom: "0.5rem",
                marginTop: "0.5rem",
                height: "auto",
              }}
            >
              <span id="bot" key={"bot"} ref={messagesEndRef}></span>
            </Row>
          </>
        ))
      ) : (
        <Row className="Wrapper">
          <span id="bot" key={"bot"} ref={messagesEndRef}></span>
        </Row>
      )}
    </Row>
  );
}

export default ChatbotBody;
