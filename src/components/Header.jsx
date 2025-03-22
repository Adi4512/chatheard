import React from "react";
import Icon from "./Icon";
import VoiceSettings from "./VoiceSettings";
import SpeedControl from "./SpeedControl";
import { useChatContext } from "../context/ChatContext";

const Header = () => {
  const { setVoice } = useChatContext();

  const handleShowHelp = () => {
    localStorage.removeItem("hasSeenWelcome");
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-3 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Icon
            name="MessageCircle"
            className="text-primary-500 mr-1.5"
            size={22}
          />
          <h1 className="text-lg font-bold text-gray-800">WhisperTalk</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-xs text-gray-600 mr-1 whitespace-nowrap">
              Voice:
            </span>
            <VoiceSettings onSelectVoice={setVoice} />
          </div>

          <div className="flex items-center">
            <span className="text-xs text-gray-600 mr-1 whitespace-nowrap">
              Speed:
            </span>
            <SpeedControl />
          </div>

          <button
            onClick={handleShowHelp}
            className="text-gray-500 hover:text-primary-600 transition-colors p-1"
            title="Show Welcome Screen"
          >
            <Icon name="HelpCircle" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
