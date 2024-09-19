import React, { ChangeEvent, ReactElement } from "react";
import ToolbarInput from "@/components/board/Toolbar/ToolbarInput";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";
import { useCanvas } from "@/contexts/CanvasContext";
import FontStyleControls from "@/components/board/Toolbar/Controls/FontStyleControls";
import { setObjectStyle } from "@/utils/board/canvasUtils";
import { UndoRedoCommand } from "@/interfaces/canvas-action";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

// when we click on an object on the canvas, we can see the object-specific controls in the toolbar
const ObjectSpecificControls: React.FC = () => {
  const {
    state: { selectedObjectStyles, canvas },
    handleStyleChange,
  } = useCanvas();

  const { saveCommand } = useUndoRedo();

  if (!selectedObjectStyles) {
    return null;
  }

  const handleChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) {
      return;
    }
    const fabricObject = canvas.getActiveObject();
    if (!fabricObject) {
      return;
    }

    const oldValue = fabricObject.get(key as keyof fabric.Object);
    const newValue = event.target.type === "number" ? parseInt(event.target.value, 10) : event.target.value;

    // I know it's cheeky, but otherwise we often register the change twice
    if (newValue === oldValue) {
      return;
    }

    setObjectStyle(canvas, fabricObject, { [key]: newValue });
    handleStyleChange();

    const command: UndoRedoCommand = {
      undo: () => {
        setObjectStyle(canvas, fabricObject, { [key]: oldValue });
      },
      redo: () => {
        setObjectStyle(canvas, fabricObject, { [key]: newValue });
      },
    };
    saveCommand(command);
  };

  const controlsMap: Record<string, ReactElement[]> = {
    [CanvasObjectTypes.I_TEXT]: [
      <ToolbarInput
        key="color"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="fontSize"
        styleKey="fontSize"
        labelText="Font Size"
        inputType="number"
        value={selectedObjectStyles.fontSize}
        onChange={handleChange("fontSize")}
      />,
      <FontStyleControls key="fontStyles" />,
    ],
    [CanvasObjectTypes.RECT]: [
      <ToolbarInput
        key="fill"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
      <ToolbarInput
        key="width"
        styleKey="width"
        labelText="Width"
        inputType="number"
        value={selectedObjectStyles.width}
        onChange={handleChange("width")}
      />,
      <ToolbarInput
        key="height"
        styleKey="height"
        labelText="Height"
        inputType="number"
        value={selectedObjectStyles.height}
        onChange={handleChange("height")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
    [CanvasObjectTypes.CIRCLE]: [
      <ToolbarInput
        key="fill"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
      <ToolbarInput
        key="radius"
        styleKey="radius"
        labelText="Radius"
        inputType="number"
        value={selectedObjectStyles.radius}
        onChange={handleChange("radius")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
    [CanvasObjectTypes.PATH]: [
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
    ],
    [CanvasObjectTypes.LINE]: [
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="width"
        styleKey="width"
        labelText="Width"
        inputType="number"
        value={selectedObjectStyles.width}
        onChange={handleChange("width")}
      />,
      <ToolbarInput
        key="height"
        styleKey="height"
        labelText="Height"
        inputType="number"
        value={selectedObjectStyles.height}
        onChange={handleChange("height")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
  };

  return controlsMap[selectedObjectStyles.type] || null;
};

export default ObjectSpecificControls;
