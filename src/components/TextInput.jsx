"use client";

import { useState, useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

const TextInput = ({ onSend, isSending, className = "" }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <div className="flex-1 border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full h-10 px-4 text-gray-700 text-base outline-none"
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!text.trim() || isSending}
        className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
        variant="primary"
      >
        <Icon name="Send" size={18} />
      </Button>
    </div>
  );
};

export default TextInput;
