import React, { useState } from "react";

interface ItemProps {
  text: string;
  hoverText: string;
  className?: string;
}

const Hexagon: React.FC<ItemProps> = ({ text, hoverText, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex h-36 w-36 items-center justify-center border text-center font-medium transition-all duration-300 ease-in-out md:h-48 md:w-48 ${className} ${
        isHovered ? "bg-primary" : "bg-muted"
      }`}
      style={{
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`p-3 transition-all duration-300 ease-in-out md:p-6 ${isHovered ? "text-xs text-muted md:text-sm" : "text-sm md:text-base"}`}
      >
        {isHovered ? hoverText : text}
      </span>
    </div>
  );
};

export default Hexagon;
