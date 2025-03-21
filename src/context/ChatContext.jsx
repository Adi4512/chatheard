import React, { createContext, useContext, useState, useCallback } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const { speak, cancel, speaking } = useSpeechSynthesis();

  // Simulate partner responses automatically
  const simulatePartnerResponse = useCallback((userMessage) => {
    // Simple responses based on user message content
    let responseText = "";

    if (
      userMessage.toLowerCase().includes("hi") ||
      userMessage.toLowerCase().includes("hello") ||
      userMessage.toLowerCase().includes("hey")
    ) {
      responseText = "Hey there! How are you doing today?";
    } else if (
      userMessage.toLowerCase().includes("love") ||
      userMessage.toLowerCase().includes("miss you")
    ) {
      responseText = "I love you too! Can't wait to see you soon! ❤️";
    } else if (userMessage.toLowerCase().includes("?")) {
      responseText =
        "That's a good question. Let me think about it and get back to you.";
    } else if (userMessage.length < 10) {
      responseText = "Tell me more, I'm listening...";
    } else {
      const responses = [
        "That's so interesting! 😊",
        "I completely understand how you feel.",
        "I wish I could be there with you right now.",
        "Thanks for sharing that with me.",
        "I'm nodding silently in agreement!",
        "That's a good point. I'm thinking about it.",
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
    }

    // Schedule the partner's response with a realistic delay
    setTimeout(() => {
      const partnerMessage = {
        id: Date.now(),
        text: responseText,
        sender: "partner",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, partnerMessage]);
    }, 1500 + Math.random() * 2000); // Add random delay between 1.5-3.5 seconds
  }, []);

  const sendMessage = useCallback(
    (text, sender = "me") => {
      if (!text.trim()) return false;

      const newMessage = {
        id: Date.now(),
        text,
        sender,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Auto-respond when the user sends a message
      if (sender === "me") {
        simulatePartnerResponse(text);
      }

      return true;
    },
    [simulatePartnerResponse]
  );

  const playMessage = useCallback(
    (message) => {
      if (speaking && playingMessageId === message.id) {
        cancel();
        setPlayingMessageId(null);
        return false;
      } else {
        if (speaking) cancel();
        speak({
          text: message.text,
          voice: selectedVoice,
          rate: 1.0,
          pitch: 1.0,
        });
        setPlayingMessageId(message.id);
        return true;
      }
    },
    [speak, cancel, speaking, playingMessageId, selectedVoice]
  );

  const setVoice = useCallback((voice) => {
    setSelectedVoice(voice);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        playMessage,
        playingMessageId,
        speaking,
        selectedVoice,
        setVoice,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
