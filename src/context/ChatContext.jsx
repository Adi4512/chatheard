import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const ChatContext = createContext(null);

// Voice profiles for browsers with limited voice options
const VOICE_PROFILES = {
  MALE: {
    pitch: 0.8,
    rate: 1.0,
  },
  FEMALE: {
    pitch: 1.2,
    rate: 1.0,
  },
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTyping, setActiveTyping] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const { speak, cancel, speaking } = useSpeechSynthesis();

  // Play text with selected voice
  const playText = useCallback(
    (text, messageId) => {
      if (!text) return;

      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Apply voice settings
      if (selectedVoice) {
        console.log("Using voice:", selectedVoice);

        // If we have an actual voice object from the browser
        if (selectedVoice.voice) {
          utterance.voice = selectedVoice.voice;
        }

        // Apply profile settings as fallback or enhancement
        if (selectedVoice.isMale) {
          utterance.pitch = VOICE_PROFILES.MALE.pitch;
          // We still respect the user's rate selection
          utterance.rate = speechRate * VOICE_PROFILES.MALE.rate;
        } else if (selectedVoice.isFemale) {
          utterance.pitch = VOICE_PROFILES.FEMALE.pitch;
          utterance.rate = speechRate * VOICE_PROFILES.FEMALE.rate;
        } else {
          utterance.rate = speechRate;
        }
      } else {
        // Default rate if no voice selected
        utterance.rate = speechRate;
      }

      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsPlaying(true);
        setPlayingMessageId(messageId);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setPlayingMessageId(null);
      };

      speechSynthesisRef.current.speak(utterance);
    },
    [selectedVoice, speechRate]
  );

  // Simulate partner responses automatically
  const simulatePartnerResponse = useCallback(
    (userMessage) => {
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

        // Automatically play the partner's message
        playText(responseText, partnerMessage.id);
      }, 1500 + Math.random() * 2000); // Add random delay between 1.5-3.5 seconds
    },
    [playText]
  );

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

      // Only play text aloud for partner messages, not user messages
      if (sender !== "me") {
        playText(text, newMessage.id);
      }

      // Auto-respond when the user sends a message
      if (sender === "me") {
        simulatePartnerResponse(text);
      }

      return true;
    },
    [simulatePartnerResponse, playText]
  );

  const playMessage = useCallback(
    (message) => {
      if (speaking && playingMessageId === message.id) {
        cancel();
        setPlayingMessageId(null);
        return false;
      } else {
        playText(message.text, message.id);
        return true;
      }
    },
    [speaking, playingMessageId, playText, cancel]
  );

  const setVoice = useCallback((voice) => {
    console.log("Setting voice in context:", voice);
    setSelectedVoice(voice);
  }, []);

  const setRate = useCallback((rate) => {
    console.log("Setting speech rate to:", rate);
    setSpeechRate(rate);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        isLoading,
        activeTyping,
        playText,
        setVoice,
        isPlaying,
        playingMessageId,
        speechRate,
        setRate,
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
