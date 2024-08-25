import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasReducerState, CanvasReducerAction } from "@/types/CanvasReducer";
import { CanvasReducerAction as CanvasReducerActionEnum } from "@/enums/CanvasReducerAction";

export const initialState: CanvasReducerState = {
  canvas: null,
  canvasMode: CanvasMode.SELECTION,
  color: "#000000",
  size: 5,
  selectedObjectStyles: null,
  activeItem: null,
};

export const canvasReducer = (state: CanvasReducerState, action: CanvasReducerAction): CanvasReducerState => {
  switch (action.type) {
    case CanvasReducerActionEnum.SET_CANVAS:
      return { ...state, canvas: action.canvas };
    case CanvasReducerActionEnum.SET_CANVAS_MODE:
      return { ...state, canvasMode: action.canvasMode };
    case CanvasReducerActionEnum.SET_COLOR:
      return { ...state, color: action.color };
    case CanvasReducerActionEnum.SET_SIZE:
      return { ...state, size: action.size };
    case CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES:
      return { ...state, selectedObjectStyles: action.styles };
    case CanvasReducerActionEnum.SET_ACTIVE_ITEM:
      return { ...state, activeItem: action.activeItem };
    default:
      return state;
  }
};
