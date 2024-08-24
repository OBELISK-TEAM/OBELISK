import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";
import { Toggle } from "@/components/ui/toggle";

interface FontStyleControlsProps {
  fontWeight: string | undefined;
  fontStyle: string | undefined;
  underline: boolean | undefined;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
}

const FontStyleControls: React.FC<FontStyleControlsProps> = ({
  fontWeight,
  fontStyle,
  underline,
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
}) => (
  <div className="flex items-center space-x-2">
    <StyledLabel>Font styles</StyledLabel>
    <Toggle aria-label="Toggle bold" pressed={fontWeight === "bold"} onPressedChange={onBoldClick}>
      <Bold className="h-4 w-4" />
    </Toggle>
    <Toggle aria-label="Toggle italic" pressed={fontStyle === "italic"} onPressedChange={onItalicClick}>
      <Italic className="h-4 w-4" />
    </Toggle>
    <Toggle aria-label="Toggle underline" pressed={underline === true} onPressedChange={onUnderlineClick}>
      <Underline className="h-4 w-4" />
    </Toggle>
  </div>
);

export default FontStyleControls;
