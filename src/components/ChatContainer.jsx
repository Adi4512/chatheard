import React, { useRef, useEffect, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";
import TextInput from "./TextInput";
import Icon from "./Icon";
import WelcomeMessage from "./WelcomeMessage";

const ChatContainer = () => {
  const { messages, addMessage, isProcessing, playingMessageId, playText } =
    useChatContext();

  // Check if welcome has been shown before
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    return hasSeenWelcome !== "true";
  });

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  }, [messages]);

  const handleSendMessage = (text) => {
    addMessage(text);
  };

  const handleDismissWelcome = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  // If showing welcome screen, render only that
  if (showWelcome) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <WelcomeMessage onDismiss={handleDismissWelcome} />
      </div>
    );
  }

  // Handle manual test of text-to-speech
  const testSpeech = () => {
    playText(
      "This is a test message to verify that text-to-speech is working properly. Can you hear this message?",
      Date.now()
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header with test button */}
      <div className="border-b border-gray-200 p-2 flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-medium text-gray-700">Chat Messages</h2>
        <button
          onClick={testSpeech}
          className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded"
        >
          Test Speech
        </button>
      </div>

      {/* Messages area with explicit scrolling */}
      <div
        className="overflow-y-scroll flex-grow"
        ref={scrollContainerRef}
        style={{
          height: "calc(100vh - 180px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db #f9fafb",
        }}
      >
        <div className="p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 py-12">
              <Icon
                name="MessageCircle"
                size={36}
                className="text-gray-300 mb-4"
              />
              <p className="text-gray-500 text-lg text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  onPlayAudio={() => playText(message.text, message.id)}
                  isPlaying={playingMessageId === message.id}
                />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Fixed input area */}
      <div className="border-t border-gray-200 py-3 px-4 bg-white shadow-md">
        <TextInput onSend={handleSendMessage} isSending={isProcessing} />
      </div>
    </div>
  );
};

export default ChatContainer;
