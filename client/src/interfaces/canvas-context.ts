import { CanvasReducerState } from "@/types/CanvasReducer";
import { MutableRefObject } from "react";
import { CanvasMode } from "@/enums/CanvasMode";

export interface CanvasContext {
  state: CanvasReducerState;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  setCanvasMode: (mode: CanvasMode) => void;
  setColor: (color: string) => void;
  setPenSize: (size: number) => void;
  setEraserSize: (size: number) => void;
  handleStyleChange: () => void;
  setActiveItem: (activeItem: string | null) => void;
  slideIndex: number;
  boardId: string;
  slideId: string | undefined;
}

export interface CanvasRef {
  current: HTMLCanvasElement | null;
}
