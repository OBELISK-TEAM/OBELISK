import { fabric } from "fabric";
import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasReducerActionEnum } from "@/enums/CanvasReducerAction";

export type CanvasReducerState = {
  canvas: fabric.Canvas | null;
  canvasMode: CanvasMode;
  color: string;
  size: number;
  selectedObjectStyles: { [key: string]: any } | null;
  activeItem: string | null;
};

export type CanvasReducerAction =
  | { type: CanvasReducerActionEnum.SET_CANVAS; canvas: fabric.Canvas | null }
  | { type: CanvasReducerActionEnum.SET_CANVAS_MODE; canvasMode: CanvasMode }
  | { type: CanvasReducerActionEnum.SET_COLOR; color: string }
  | { type: CanvasReducerActionEnum.SET_SIZE; size: number }
  | { type: CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES; styles: { [key: string]: any } | null } // it is only created for updating toolbar
  | { type: CanvasReducerActionEnum.SET_ACTIVE_ITEM; activeItem: string | null };
