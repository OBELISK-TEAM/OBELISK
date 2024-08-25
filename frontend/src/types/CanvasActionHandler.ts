import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasActionProperties } from "@/interfaces/canvas-action-properties";

export type CanvasActionHandler = (args: {
  canvas?: fabric.Canvas | null;
  properties?: CanvasActionProperties;
  setCanvasMode?: (mode: CanvasMode) => void;
  undo?: () => void;
  redo?: () => void;
  color?: string;
  size?: number;
}) => void;
