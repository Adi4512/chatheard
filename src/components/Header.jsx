import React from "react";
import Icon from "./Icon";
import VoiceSettings from "./VoiceSettings";
import { useChat } from "../context/ChatContext";

const Header = () => {
  const { setVoice } = useChat();

  return (
    <header className="bg-white py-4 px-6 shadow-sm bg-opacity-80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-love to-love-light flex items-center justify-center shadow-md">
              <Icon name="Heart" className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-love-dark via-love to-secondary-500 text-transparent bg-clip-text">
              WhisperTalk
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500 hidden md:block font-medium">
              Let your messages be heard
            </p>
            <VoiceSettings onSelectVoice={setVoice} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
