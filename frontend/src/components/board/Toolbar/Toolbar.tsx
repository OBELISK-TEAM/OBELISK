"use client";
import React, { ChangeEvent, ReactElement, useRef } from "react";
import { Input } from "@/components/ui/input";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";
import { Button } from "../../ui/button";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { useFile } from "@/contexts/FileContext";
import ToolbarInput from "@/components/board/Toolbar/ToolbarInput";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";
import FontStyleControls from "@/components/board/Toolbar/FontStyleControls";

const styleToggle =
  (
    selectedStyles: Record<string, any> | null,
    handleStyleChange: ((style: Record<string, any>) => void) | undefined,
    styleKey: string,
    valueTrue: string | boolean,
    valueFalse: string | boolean
  ) =>
  () => {
    if (handleStyleChange) {
      handleStyleChange({
        [styleKey]: selectedStyles?.[styleKey] === valueTrue ? valueFalse : valueTrue,
      });
    }
  };

const BoardToolBar: React.FC = () => {
  const {
    state: { activeItem, selectedObjectStyles },
    handleStyleChange,
  } = useCanvas();
  const { handleAddImageByUrl } = useFile();
  const urlRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === "number" ? parseInt(event.target.value, 10) : event.target.value;
    handleStyleChange?.({ [key]: value });
  };

  const onBoldClick = styleToggle(selectedObjectStyles, handleStyleChange, "fontWeight", "bold", "normal");
  const onItalicClick = styleToggle(selectedObjectStyles, handleStyleChange, "fontStyle", "italic", "normal");
  const onUnderlineClick = styleToggle(selectedObjectStyles, handleStyleChange, "underline", true, false);

  const handleAddUrlClick = () => {
    if (urlRef.current) {
      handleAddImageByUrl(urlRef.current.value);
      urlRef.current.value = "";
    }
  };

  const renderUrlControl = () => (
    <div className="flex items-center space-x-2">
      <StyledLabel htmlFor="image-url">Image URL:</StyledLabel>
      <Input type="text" id="image-url" className="w-64" ref={urlRef} />
      <Button onClick={handleAddUrlClick}>Add Image</Button>
    </div>
  );

  const renderControls = () => {
    if (!selectedObjectStyles) {
      return null;
    }

    const controlsMap: Record<string, ReactElement[]> = {
      [CanvasObjectTypes.IText]: [
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
        <FontStyleControls
          key="fontStyles"
          fontWeight={selectedObjectStyles.fontWeight}
          fontStyle={selectedObjectStyles.fontStyle}
          underline={selectedObjectStyles.underline}
          onBoldClick={onBoldClick}
          onItalicClick={onItalicClick}
          onUnderlineClick={onUnderlineClick}
        />,
      ],
      [CanvasObjectTypes.Rect]: [
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
      [CanvasObjectTypes.Circle]: [
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
      [CanvasObjectTypes.Path]: [
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
      [CanvasObjectTypes.Line]: [
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

  return (
    <div className="flex h-[50px] w-full items-center justify-between bg-background text-muted-foreground">
      <div className="flex items-center space-x-4 p-2">
        {activeItem === MenuActions.AddImageUrl ? renderUrlControl() : renderControls()}
      </div>
    </div>
  );
};

export default BoardToolBar;
