import React, { useState } from "react";

interface HexagonProps {
  text: string;
  hoverText: string;
  className?: string;
}

const StartPageHexagon: React.FC<HexagonProps> = ({ text, hoverText, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex h-36 w-36 cursor-pointer items-center justify-center border text-center font-medium transition-all delay-100 duration-300 ease-in-out hover:scale-110 md:h-48 md:w-48 ${className} ${
        isHovered ? "bg-primary" : "bg-muted"
      }`}
      style={{
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-3 md:p-6">
        <div className={`transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
          <span className="text-sm md:text-base">{text}</span>
        </div>
        <div
          className={`absolute left-0 top-0 flex h-[100%] w-[100%] items-center justify-center p-4 transition-opacity delay-150 duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-xs text-muted md:text-sm">{hoverText}</span>
        </div>
      </div>
    </div>
  );
};

export default StartPageHexagon;
