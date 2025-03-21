import React from "react";
import Icon from "./Icon";
import Button from "./Button";

const WelcomeMessage = ({ onDismiss }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-love to-secondary-500 rounded-full flex items-center justify-center mb-4">
            <Icon name="Heart" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-love-dark via-love to-secondary-500 text-transparent bg-clip-text">
            Welcome to WhisperTalk
          </h2>
          <p className="text-gray-600">
            Your private voice messaging app for discreet communication
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <Icon name="Info" size={16} className="text-primary-500 mr-2" />
            How it works
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <Icon
                name="MessageSquare"
                size={16}
                className="text-gray-400 mr-2 mt-0.5"
              />
              <span>Type your message in the input box below</span>
            </li>
            <li className="flex items-start">
              <Icon
                name="Send"
                size={16}
                className="text-gray-400 mr-2 mt-0.5"
              />
              <span>Press Enter or click Send to share your message</span>
            </li>
            <li className="flex items-start">
              <Icon
                name="Volume2"
                size={16}
                className="text-gray-400 mr-2 mt-0.5"
              />
              <span>
                Partner messages are automatically read aloud when received
              </span>
            </li>
            <li className="flex items-start">
              <Icon
                name="Mic"
                size={16}
                className="text-gray-400 mr-2 mt-0.5"
              />
              <span>
                Switch between male and female voice using the voice button in
                the header
              </span>
            </li>
            <li className="flex items-start">
              <Icon
                name="Speed"
                size={16}
                className="text-gray-400 mr-2 mt-0.5"
              />
              <span>
                Adjust the speaking speed (1x, 1.25x, 1.5x, 2x) using the speed
                button
              </span>
            </li>
          </ul>
        </div>

        <div className="mb-5 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <Icon
              name="AlertCircle"
              size={14}
              className="text-blue-500 mr-2 mt-0.5"
            />
            <div>
              <span className="font-medium text-blue-700">
                Note about voices:{" "}
              </span>
              If the voice options don't sound distinct enough, you may need to
              install additional voice packs in your operating system.
              WhisperTalk will automatically use the best voices available on
              your device.
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onDismiss} size="lg" className="w-full">
            Let's Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
