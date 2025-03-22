import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

const VoiceSettings = ({ onSelectVoice }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [voiceDetectionComplete, setVoiceDetectionComplete] = useState(false);
  const dropdownRef = useRef(null);
  const [debugMode, setDebugMode] = useState(false);

  // Debug function to test a voice directly
  const testVoice = (voice) => {
    if (!voice) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const testUtterance = new SpeechSynthesisUtterance(
      "This is a test of the voice selection feature"
    );
    if (voice.voice) {
      testUtterance.voice = voice.voice;
    }

    // Apply different pitch based on gender
    if (voice.isMale) {
      testUtterance.pitch = 0.8;
    } else if (voice.isFemale) {
      testUtterance.pitch = 1.2;
    }

    window.speechSynthesis.speak(testUtterance);
    console.log("Testing voice:", voice);
  };

  useEffect(() => {
    const populateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      console.log("Available voices:", allVoices);

      // Force a delay to ensure voices are loaded (helps in some browsers)
      setTimeout(() => {
        // Get voices again after delay to ensure they're loaded
        const allVoicesAfterDelay = window.speechSynthesis.getVoices();

        // Find the best male and female voices
        const bestMaleVoice = findBestMaleVoice(allVoicesAfterDelay);
        const bestFemaleVoice = findBestFemaleVoice(allVoicesAfterDelay);

        // Fallback voices with profile information
        const maleVoice = {
          name: "Male Voice",
          isMale: true,
          voice: bestMaleVoice,
          browserSupported: !!bestMaleVoice,
        };

        const femaleVoice = {
          name: "Female Voice",
          isFemale: true,
          voice: bestFemaleVoice,
          browserSupported: !!bestFemaleVoice,
        };

        const filteredVoices = [maleVoice, femaleVoice];
        console.log("Voice options created:", filteredVoices);
        setVoices(filteredVoices);
        setVoiceDetectionComplete(true);

        // Set default voice (female preferred for starting)
        if (!selectedVoice) {
          setSelectedVoice(femaleVoice);
          onSelectVoice && onSelectVoice(femaleVoice);
        }
      }, 500);
    };

    const findBestMaleVoice = (allVoices) => {
      // First try to find explicit male voice in English
      const explicitMaleVoice = allVoices.find(
        (voice) =>
          voice.name.toLowerCase().includes("male") &&
          !voice.name.toLowerCase().includes("female") &&
          (voice.lang.includes("en") || voice.name.includes("English"))
      );

      if (explicitMaleVoice) return explicitMaleVoice;

      // Then try to find any voice that might be male (not explicitly female)
      const probablyMaleVoice = allVoices.find(
        (voice) =>
          !voice.name.toLowerCase().includes("female") &&
          (voice.lang.includes("en") || voice.name.includes("English"))
      );

      if (probablyMaleVoice) return probablyMaleVoice;

      // Fallback to any English voice or the first voice
      const anyEnglishVoice = allVoices.find(
        (voice) => voice.lang.includes("en") || voice.name.includes("English")
      );

      return anyEnglishVoice || allVoices[0];
    };

    const findBestFemaleVoice = (allVoices) => {
      // Try to find explicit female voice in English
      const explicitFemaleVoice = allVoices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") &&
          (voice.lang.includes("en") || voice.name.includes("English"))
      );

      if (explicitFemaleVoice) return explicitFemaleVoice;

      // Fallback to any English voice that might be female
      const probablyFemaleVoice = allVoices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );

      if (probablyFemaleVoice) return probablyFemaleVoice;

      // Just pick any English voice different from male if possible
      const maleVoice = findBestMaleVoice(allVoices);
      const differentVoice = allVoices.find(
        (voice) =>
          voice !== maleVoice &&
          (voice.lang.includes("en") || voice.name.includes("English"))
      );

      return differentVoice || allVoices[0];
    };

    // Initial population
    populateVoices();

    // Chrome requires a listener for voiceschanged
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onSelectVoice, selectedVoice]);

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
    console.log("Selected voice:", voice);
    setSelectedVoice(voice);
    onSelectVoice && onSelectVoice(voice);
    setIsOpen(false);

    // Test the voice immediately when selected (helps debugging)
    if (debugMode) {
      testVoice(voice);
    }
  };

  if (!selectedVoice) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Icon name="Mic" size={14} className="mr-1.5 text-gray-500" />
        {selectedVoice.name === "Male Voice" ? "Male" : "Female"}
      </button>

      {isOpen && voices.length > 0 && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {voices.map((voice) => (
              <button
                key={voice.name}
                onClick={() => handleSelectVoice(voice)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedVoice.name === voice.name
                    ? "text-primary-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {voice.name === "Male Voice" ? "Male" : "Female"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSettings;
