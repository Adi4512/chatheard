import React, { useState, useEffect, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import Icon from "./Icon";

const SpeedControl = () => {
  const { speechRate, setRate } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const speedOptions = [
    { value: 1, label: "1x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];

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

  const handleSelectSpeed = (speed) => {
    setRate(speed);
    setIsOpen(false);
  };

  const currentSpeedLabel =
    speedOptions.find((option) => option.value === speechRate)?.label || "1x";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Icon name="Clock" size={14} className="mr-1.5 text-gray-500" />
        {currentSpeedLabel}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectSpeed(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  speechRate === option.value
                    ? "text-primary-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedControl;
