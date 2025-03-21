import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import TextInput from "./TextInput";
import Button from "./Button";
import Icon from "./Icon";
import WelcomeMessage from "./WelcomeMessage";
import { useChat } from "../context/ChatContext";

const ChatContainer = () => {
  const [inputText, setInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const chatEndRef = useRef(null);
  const { messages, sendMessage, playText, playingMessageId, isPlaying } =
    useChat();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (sendMessage(inputText)) {
      setInputText("");
    }
  };

  const handlePlayMessage = (message) => {
    // Only partner messages can be played manually
    if (message.sender === "partner") {
      playText(message.text, message.id);
    }
  };

  if (showWelcome) {
    return <WelcomeMessage onDismiss={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Icon name="MessageSquare" size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No messages yet
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-sm">
              Type something below and press send to start your silent
              conversation
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
              onPlayAudio={() => handlePlayMessage(message)}
              isPlaying={isPlaying && playingMessageId === message.id}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4 lg:p-6 bg-white">
        <div className="flex space-x-2 items-end">
          <TextInput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            variant="primary"
            className="rounded-full h-12 w-12 p-0 flex items-center justify-center"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
