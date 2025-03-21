import React from "react";
import Icon from "./Icon";

const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          className={`min-h-12 w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border"
          } ${className}`}
          placeholder={placeholder}
          rows="2"
          {...props}
        />
        <div className="absolute right-3 bottom-3 flex items-center space-x-1 text-gray-400">
          <Icon name="MessageSquare" size={14} />
          <span className="text-xs">Enter to send</span>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;
