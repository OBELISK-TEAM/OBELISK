import { fabric } from "fabric";
import { CanvasMode } from "@/enums/CanvasMode";

export type State = {
  canvas: fabric.Canvas | null;
  canvasMode: CanvasMode;
  color: string;
  size: number;
  selectedObjectStyles: { [key: string]: any } | null;
  activeItem: string | null;
};

export type Action =
  | { type: "SET_CANVAS"; canvas: fabric.Canvas | null }
  | { type: "SET_CANVAS_MODE"; canvasMode: CanvasMode }
  | { type: "SET_COLOR"; color: string }
  | { type: "SET_SIZE"; size: number }
  | { type: "SET_SELECTED_OBJECT_STYLES"; styles: { [key: string]: any } | null }
  | { type: "SET_ACTIVE_ITEM"; activeItem: string | null };

export const initialState: State = {
  canvas: null,
  canvasMode: CanvasMode.Selection,
  color: "#000000",
  size: 5,
  selectedObjectStyles: null,
  activeItem: null,
};

export enum ActionTypes {
  SET_CANVAS = "SET_CANVAS",
  SET_CANVAS_MODE = "SET_CANVAS_MODE",
  SET_COLOR = "SET_COLOR",
  SET_SIZE = "SET_SIZE",
  SET_SELECTED_OBJECT_STYLES = "SET_SELECTED_OBJECT_STYLES",
  SET_ACTIVE_ITEM = "SET_ACTIVE_ITEM",
}

export const canvasReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_CANVAS:
      return { ...state, canvas: action.canvas };
    case ActionTypes.SET_CANVAS_MODE:
      return { ...state, canvasMode: action.canvasMode };
    case ActionTypes.SET_COLOR:
      return { ...state, color: action.color };
    case ActionTypes.SET_SIZE:
      return { ...state, size: action.size };
    case ActionTypes.SET_SELECTED_OBJECT_STYLES:
      return { ...state, selectedObjectStyles: action.styles };
    case ActionTypes.SET_ACTIVE_ITEM:
      return { ...state, activeItem: action.activeItem };
    default:
      return state;
  }
};
