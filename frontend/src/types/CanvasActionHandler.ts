import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasActionPropertiesI } from "@/interfaces/canvas-action-properties";

export type CanvasActionHandler = (args: {
  canvas?: fabric.Canvas | null;
  properties?: CanvasActionPropertiesI;
  setCanvasMode?: (mode: CanvasMode) => void;
  undo?: () => void;
  redo?: () => void;
  color?: string;
  size?: number;
}) => void;
