import React from "react";
import Icon from "./Icon";
import Button from "./Button";

const WelcomeMessage = ({ onDismiss }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg max-w-lg mx-auto mt-8 w-full">
      <div className="text-center mb-6">
        <div className="bg-primary-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
          <Icon name="MessageCircle" size={28} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to WhisperTalk!
        </h2>
        <p className="text-gray-600">Your voice messaging app for couples</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
          <Icon name="Info" size={16} className="text-primary-500 mr-2" />
          How it works
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <Icon
              name="Type"
              size={16}
              className="text-primary-400 mr-3 mt-0.5"
            />
            <span>Type your message in the chat input</span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Send"
              size={16}
              className="text-primary-400 mr-3 mt-0.5"
            />
            <span>Press Enter or click Send to share it</span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Volume2"
              size={16}
              className="text-primary-400 mr-3 mt-0.5"
            />
            <span>Messages are automatically read aloud</span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Mic"
              size={16}
              className="text-primary-400 mr-3 mt-0.5"
            />
            <span>Switch between male and female voices in the header</span>
          </li>
          <li className="flex items-start">
            <Icon
              name="Clock"
              size={16}
              className="text-primary-400 mr-3 mt-0.5"
            />
            <span>Adjust the speaking speed (1x-2x) as needed</span>
          </li>
        </ul>
      </div>

      <Button
        onClick={onDismiss}
        className="w-full py-3 text-base justify-center"
      >
        Let's Get Started
      </Button>
    </div>
  );
};

export default WelcomeMessage;
