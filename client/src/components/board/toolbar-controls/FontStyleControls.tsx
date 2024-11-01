import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import StyledLabel from "@/components/board/toolbar/ToolbarLabel";
import { Toggle } from "@/components/ui/toggle";
import { useCanvas } from "@/contexts/CanvasContext";
import { fabric } from "fabric";
import { setObjectStyle } from "@/lib/board/canvasUtils";
import { useUndoRedo } from "@/contexts/UndoRedoContext";
import { useSocket } from "@/contexts/SocketContext";

const FontStyleControls: React.FC = () => {
  const {
    state: { selectedObjectStyles, canvas },
    handleStyleChange,
  } = useCanvas();
  const { socket } = useSocket();
  const { saveCommand } = useUndoRedo();

  const styleToggle = (
    styleKey: "fontWeight" | "fontStyle" | "underline",
    valueTrue: string | boolean,
    valueFalse: string | boolean
  ) => {
    if (!canvas) {
      return;
    }

    const modifiedObject = canvas.getActiveObject();
    if (!modifiedObject) {
      return;
    }
    if (!(modifiedObject instanceof fabric.Text)) {
      return;
    }

    const oldValue = modifiedObject[styleKey];
    const newValue = modifiedObject[styleKey] === valueTrue ? valueFalse : valueTrue;

    setObjectStyle(canvas, modifiedObject, { [styleKey]: newValue });
    handleStyleChange();
    debouncedToolbarHandleChange(styleKey, modifiedObject, oldValue, socket, canvas, saveCommand);
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
