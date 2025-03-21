import React from "react";
import * as LucideIcons from "lucide-react";

const Icon = ({ name, size = 24, className = "", ...props }) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.error(`Icon "${name}" does not exist in Lucide icons`);
    return null;
  }

  return <LucideIcon size={size} className={className} {...props} />;
};

export default Icon;
