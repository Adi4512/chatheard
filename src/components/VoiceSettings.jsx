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
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium rounded-full px-4 py-2 text-sm"
      >
        <Icon name="Mic" size={16} />
        <span className="max-w-28 truncate">{selectedVoice.name}</span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} />
      </button>

      {isOpen && voices.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Select Voice</h3>
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
                {voiceDetectionComplete && !voice.browserSupported && (
                  <span className="text-xs text-amber-500 ml-1">
                    (simulated)
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Debug tools section */}
          <div className="mt-2 px-4 py-2 border-t border-gray-100">
            {!voiceDetectionComplete ? (
              <div className="text-xs text-gray-500">Loading voices...</div>
            ) : (
              <div
                className="text-xs text-gray-500 cursor-pointer"
                onClick={() => setDebugMode(!debugMode)}
                onDoubleClick={() => testVoice(selectedVoice)}
              >
                {!voices.some((v) => v.browserSupported) && (
                  <div className="text-xs text-amber-600 mb-1">
                    Using simulated voice profiles. Download voice packs for
                    better results.
                  </div>
                )}
                {debugMode ? "Debug Mode ON" : ""}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSettings;
