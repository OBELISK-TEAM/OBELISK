import { CanvasReducerState } from "@/types/CanvasReducer";
import { MutableRefObject } from "react";
import { CanvasMode } from "@/enums/CanvasMode";

export interface CanvasContextI {
  state: CanvasReducerState;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  setCanvasMode: (mode: CanvasMode) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  handleStyleChange: (styles: object) => void;
  setActiveItem: (activeItem: string | null) => void;
}

export interface CanvasRefI {
  current: HTMLCanvasElement | null;
}
