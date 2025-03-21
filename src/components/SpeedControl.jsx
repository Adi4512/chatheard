import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import Icon from "./Icon";

const SpeedControl = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { speechRate, setRate } = useChat();
  const speedOptions = [1, 1.25, 1.5, 2.0];
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle speed selection
  const handleSelectSpeed = (speed) => {
    setRate(speed);
    setIsOpen(false);
  };

  // Get current speed label
  const getSpeedLabel = () => {
    return `${speechRate}x`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white border border-gray-200 rounded-full py-1.5 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition duration-150 group shadow-sm"
      >
        <Icon
          name="FastForward"
          size={14}
          className="mr-1.5 text-primary-500"
        />
        <span>{getSpeedLabel()}</span>
        <Icon
          name="ChevronDown"
          size={14}
          className={`ml-1 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-white rounded-lg shadow-lg py-1 z-20">
          {speedOptions.map((speed) => (
            <div
              key={speed}
              onClick={() => handleSelectSpeed(speed)}
              className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50 transition duration-150
                ${
                  speechRate === speed
                    ? "text-primary-600 font-medium bg-primary-50"
                    : "text-gray-700"
                }`}
            >
              {speed}x
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeedControl;
