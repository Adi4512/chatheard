import React from "react";
import Icon from "./Icon";

const ChatMessage = ({
  message,
  sender,
  timestamp,
  onPlayAudio,
  isPlaying,
  className = "",
}) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCurrentUser = sender === "me";

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4 ${className}`}
    >
      <div
        className={`max-w-[85%] ${
          isCurrentUser ? "order-last" : "order-first"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center mb-1 text-xs text-gray-500">
            <span className="font-medium">
              {isCurrentUser ? "You" : "Partner"}
            </span>
            <span className="mx-2">•</span>
            <span>{formattedTime}</span>
            {isPlaying && (
              <span className="ml-2 flex items-center text-primary-500">
                <Icon name="Volume2" size={12} className="mr-1" />
                Speaking...
              </span>
            )}
          </div>
          <div
            className={`rounded-2xl p-4 shadow-sm ${
              isCurrentUser
                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            <p className="whitespace-pre-wrap">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
