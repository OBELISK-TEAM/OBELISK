import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";
import { Toggle } from "@/components/ui/toggle";
import { useCanvas } from "@/contexts/CanvasContext";
import { fabric } from "fabric";
import { setObjectStyle } from "@/lib/board/canvasUtils";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

const FontStyleControls: React.FC = () => {
  const {
    state: { selectedObjectStyles, canvas },
    handleStyleChange,
  } = useCanvas();

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

    const modifiedObjectJSON = modifiedObject.toJSON(["_id"]);
    const clonedJSON = JSON.parse(JSON.stringify(modifiedObjectJSON));
    Object.assign(clonedJSON, { [styleKey]: oldValue });

    const command = new ModifyCommand(canvas, clonedJSON, modifiedObjectJSON, handleStyleChange);
    saveCommand(command);
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
