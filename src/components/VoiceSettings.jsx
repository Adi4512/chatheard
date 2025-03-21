import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

const VoiceSettings = ({ onSelectVoice }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Set default voice
      if (availableVoices.length > 0) {
        const defaultVoice =
          availableVoices.find((v) => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice);
        onSelectVoice && onSelectVoice(defaultVoice);
      }
    };

    populateVoices();

    // Chrome requires a listener for voiceschanged
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onSelectVoice]);

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

  const handleSelectVoice = (voice) => {
    setSelectedVoice(voice);
    onSelectVoice && onSelectVoice(voice);
    setIsOpen(false);
  };

  if (!selectedVoice) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium rounded-full px-4 py-2 text-sm"
      >
        <Icon name="Mic" size={16} />
        <span className="max-w-28 truncate">
          {selectedVoice.name.split(" ")[0]}
        </span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Select Voice</h3>
            <p className="text-gray-500 text-xs">Choose your preferred voice</p>
          </div>
          <ul className="py-1">
            {voices.map((voice) => (
              <li
                key={voice.name}
                onClick={() => handleSelectVoice(voice)}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                  selectedVoice.name === voice.name
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700"
                }`}
              >
                {selectedVoice.name === voice.name && (
                  <Icon name="Check" size={16} className="text-primary-600" />
                )}
                <span
                  className={
                    selectedVoice.name === voice.name ? "font-medium" : ""
                  }
                >
                  {voice.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceSettings;
