import React, { ChangeEvent, ReactElement, useCallback } from "react";
import ToolbarInput from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/toolbar/ToolbarInput";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";
import { useCanvas } from "@/contexts/CanvasContext";
import FontStyleControls from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/toolbar/controls/FontStyleControls";
import { setObjectStyle } from "@/lib/board/canvasUtils";
import { fabric } from "fabric";
import { useSocket } from "@/contexts/SocketContext";
import { useUndoRedo } from "@/contexts/UndoRedoContext";
import { useToolbar } from "@/contexts/ToolbarContext";

// when we click on an object on the canvas, we can see the object-specific controls in the toolbar
const ObjectSpecificControls: React.FC = () => {
  const {
    state: { selectedObjectStyles, canvas },
    handleStyleChange,
  } = useCanvas();
  const { socket } = useSocket();
  const { handleToolbarChangeDebounced } = useToolbar();

  const { saveCommand } = useUndoRedo();

  const handleChange = useCallback(
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!canvas || !socket) {
        return;
      }
      const modifiedObject = canvas.getActiveObject();
      if (!modifiedObject) {
        return;
      }

      const oldValue = modifiedObject.get(key as keyof fabric.Object);
      const newValue = event.target.type === "number" ? parseInt(event.target.value, 10) : event.target.value;

      // I know it's cheeky, but otherwise we often register the change twice
      if (newValue === oldValue) {
        return;
      }

      setObjectStyle(canvas, modifiedObject, { [key]: newValue });
      handleStyleChange();
      handleToolbarChangeDebounced(key, modifiedObject, oldValue, socket, canvas, saveCommand);
    },
    [canvas, socket, saveCommand] // no more, no less
  );

  if (!selectedObjectStyles) {
    return null;
  }
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
