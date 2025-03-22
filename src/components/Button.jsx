import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  // Define base styles
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  // Define variant styles
  const variantStyles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md focus:ring-primary-600",
    secondary:
      "bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-md focus:ring-secondary-600",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400",
    ghost:
      "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-400",
    link: "bg-transparent underline-offset-4 hover:underline text-primary-600 focus:ring-primary-500",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md focus:ring-red-600",
  };

  // Define size styles
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // Combine all styles
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
