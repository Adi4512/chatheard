import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useSpeechSynthesis } from "react-speech-kit";

// Create context
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

// Split long text into manageable chunks for speech synthesis
const splitTextIntoChunks = (text, maxLength = 150) => {
  if (!text || typeof text !== "string") return [""];

  // Add a small pause at the beginning to prevent first word skipping
  text = " " + text.trim();

  if (text.length <= maxLength) return [text];

  // Try to split at sentence or comma boundaries
  const sentenceBreaks = text.match(/[^.!?;,]+[.!?;,]+/g) || [];
  if (!sentenceBreaks.length) return [text]; // If no sentence boundaries found

  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentenceBreaks) {
    // If adding this sentence would make chunk too long, push current chunk
    if (
      (currentChunk + sentence).length > maxLength &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  // Add the final chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  // If somehow we ended up with no chunks, just split the text
  if (chunks.length === 0) {
    // Simple fallback if sentence splitting fails: split by size
    for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.substring(i, i + maxLength));
    }
  }

  return chunks;
};

// Custom hook to use the chat context - defined here but not exported until the end
const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

// Provider component
function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTyping, setActiveTyping] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const textChunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const { speak, cancel, speaking } = useSpeechSynthesis();

  // Initialize speech synthesis and ensure it's available
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Re-initialize speechSynthesis reference
      speechSynthesisRef.current = window.speechSynthesis;

      // Check if voices are available
      const checkVoices = () => {
        const voices = speechSynthesisRef.current.getVoices();
        if (voices.length > 0) {
          console.log(`${voices.length} voices available for speech synthesis`);
        }
      };

      // Voices might not be loaded immediately
      speechSynthesisRef.current.onvoiceschanged = checkVoices;
      checkVoices(); // Check immediately too
    } else {
      console.error("Speech synthesis not supported in this browser");
    }

    // Cleanup function
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Helper to handle speech synthesis errors and events
  const setupUtteranceEvents = (utterance, messageId, isLastChunk = false) => {
    utterance.onstart = () => {
      console.log("Speech started for message:", messageId);
      setIsPlaying(true);
      setPlayingMessageId(messageId);
    };

    utterance.onend = () => {
      console.log("Speech ended for current chunk");

      // If we have more chunks to speak
      if (
        !isLastChunk &&
        textChunksRef.current.length > currentChunkIndexRef.current + 1
      ) {
        currentChunkIndexRef.current++;
        speakNextChunk(messageId);
      } else {
        // We're done with all chunks
        console.log("All chunks spoken for message:", messageId);
        textChunksRef.current = [];
        currentChunkIndexRef.current = 0;
        setIsPlaying(false);
        setPlayingMessageId(null);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      // Try to recover by moving to next chunk or finishing
      if (
        !isLastChunk &&
        textChunksRef.current.length > currentChunkIndexRef.current + 1
      ) {
        currentChunkIndexRef.current++;
        speakNextChunk(messageId);
      } else {
        textChunksRef.current = [];
        currentChunkIndexRef.current = 0;
        setIsPlaying(false);
        setPlayingMessageId(null);
      }
    };

    return utterance;
  };

  // Function to speak the next chunk of text
  const speakNextChunk = (messageId) => {
    if (textChunksRef.current.length <= currentChunkIndexRef.current) {
      console.log("No more chunks to speak");
      setIsPlaying(false);
      setPlayingMessageId(null);
      return;
    }

    const currentChunk = textChunksRef.current[currentChunkIndexRef.current];
    const isLastChunk =
      currentChunkIndexRef.current === textChunksRef.current.length - 1;

    console.log(
      `Speaking chunk ${currentChunkIndexRef.current + 1}/${
        textChunksRef.current.length
      }: "${currentChunk}"`
    );

    // Create a slight delay before speaking to prevent first word being cut off
    setTimeout(() => {
      // Cancel any ongoing speech first
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(currentChunk);

      // Apply voice settings
      if (selectedVoice) {
        // If we have an actual voice object from the browser
        if (selectedVoice.voice) {
          utterance.voice = selectedVoice.voice;
        }

        // Apply profile settings as fallback or enhancement
        if (selectedVoice.isMale) {
          utterance.pitch = VOICE_PROFILES.MALE.pitch;
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

      utteranceRef.current = setupUtteranceEvents(
        utterance,
        messageId,
        isLastChunk
      );

      try {
        speechSynthesisRef.current.speak(utterance);
      } catch (error) {
        console.error("Error speaking:", error);
        setIsPlaying(false);
        setPlayingMessageId(null);
      }
    }, 150); // Small delay to ensure speech engine is ready
  };

  // Play text with selected voice
  const playText = useCallback(
    (text, messageId) => {
      if (!text) {
        console.log("No text provided to playText");
        return;
      }

      console.log("PlayText called with text:", text);

      // Cancel any ongoing speech
      if (speechSynthesisRef.current) {
        console.log("Cancelling previous speech");
        speechSynthesisRef.current.cancel();
      }

      // Use direct browser API instead of react-speech-kit
      try {
        // Prepare the initial utterance with the complete text
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice if available
        if (selectedVoice && selectedVoice.voice) {
          utterance.voice = selectedVoice.voice;
        }

        // Set rate and pitch
        if (selectedVoice && selectedVoice.isMale) {
          utterance.pitch = VOICE_PROFILES.MALE.pitch;
          utterance.rate = speechRate * VOICE_PROFILES.MALE.rate;
        } else if (selectedVoice && selectedVoice.isFemale) {
          utterance.pitch = VOICE_PROFILES.FEMALE.pitch;
          utterance.rate = speechRate * VOICE_PROFILES.FEMALE.rate;
        } else {
          utterance.rate = speechRate;
        }

        // Set event handlers
        utterance.onstart = () => {
          console.log("Speech started for message:", messageId);
          setIsPlaying(true);
          setPlayingMessageId(messageId);
        };

        utterance.onend = () => {
          console.log("Speech ended for message:", messageId);
          setIsPlaying(false);
          setPlayingMessageId(null);
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          setIsPlaying(false);
          setPlayingMessageId(null);
        };

        // Store the utterance reference
        utteranceRef.current = utterance;

        // Speak the text
        console.log("Speaking text:", text);
        speechSynthesisRef.current.speak(utterance);
      } catch (error) {
        console.error("Error in text-to-speech:", error);
      }
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
        responseText = "Kuch nahi baby";
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
      console.log("Attempting to play message:", message);

      if (speaking && playingMessageId === message.id) {
        console.log("Stopping playback of current message");

        // Cancel using browser API
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.cancel();
        }

        // Also use react-speech-kit for redundancy
        cancel();

        setIsPlaying(false);
        setPlayingMessageId(null);
        return false;
      } else {
        console.log("Playing message:", message.id);
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
        addMessage: sendMessage,
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
}

export { ChatProvider, useChatContext };
