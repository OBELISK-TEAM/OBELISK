import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";
import { Toggle } from "@/components/ui/toggle";
import { useCanvas } from "@/contexts/CanvasContext";

const FontStyleControls: React.FC = () => {
  const {
    state: { selectedObjectStyles },
    handleStyleChange,
  } = useCanvas();
  const styleToggle = (styleKey: string, valueTrue: string | boolean, valueFalse: string | boolean) => {
    if (handleStyleChange) {
      handleStyleChange({
        [styleKey]: selectedObjectStyles?.[styleKey] === valueTrue ? valueFalse : valueTrue,
      });
    }
  };

  const onBoldClick = () => styleToggle("fontWeight", "bold", "normal");
  const onItalicClick = () => styleToggle("fontStyle", "italic", "normal");
  const onUnderlineClick = () => styleToggle("underline", true, false);

  return (
    <div className="flex items-center space-x-2">
      <StyledLabel>Font styles</StyledLabel>
      <Toggle
        aria-label="Toggle bold"
        pressed={selectedObjectStyles?.fontWeight === "bold"}
        onPressedChange={onBoldClick}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        pressed={selectedObjectStyles?.fontStyle === "italic"}
        onPressedChange={onItalicClick}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle underline"
        pressed={selectedObjectStyles?.underline === true}
        onPressedChange={onUnderlineClick}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default FontStyleControls;
