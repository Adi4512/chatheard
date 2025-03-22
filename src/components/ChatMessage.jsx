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

  const handleClick = () => {
    if (!isCurrentUser && onPlayAudio) {
      onPlayAudio();
    }
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-3 ${className}`}
    >
      <div
        className={`max-w-[75%] ${
          isCurrentUser ? "order-last" : "order-first"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center mb-1 text-xs text-gray-500">
            <span className="font-medium">
              {isCurrentUser ? "You" : "Partner"}
            </span>
            <span className="mx-1">•</span>
            <span>{formattedTime}</span>
            {isPlaying && (
              <span className="ml-2 flex items-center text-primary-500 animate-pulse">
                <Icon name="Volume2" size={12} className="mr-1" />
                <span>Speaking...</span>
              </span>
            )}
          </div>
          <div
            onClick={handleClick}
            className={`rounded-lg px-4 py-2.5 shadow-sm transition-all ${
              isCurrentUser
                ? "bg-primary-600 text-white"
                : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 " +
                  (!isCurrentUser ? "cursor-pointer active:bg-gray-200" : "")
            }`}
          >
            {!isCurrentUser && (
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                <Icon
                  name={isPlaying ? "Volume2" : "VolumeX"}
                  size={14}
                  className="text-primary-500"
                />
                <span className="font-medium text-primary-600">
                  {isPlaying ? "Playing..." : "Tap to hear"}
                </span>
              </div>
            )}
            <p className="whitespace-pre-wrap text-base">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
