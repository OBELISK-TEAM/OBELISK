import { CanvasEventListenersAction } from "@/types/CanvasEventListenersAction";

export const initialState = {
  observedTextId: undefined as string | undefined,
  observedTextContent: undefined as string | undefined,
  recentlyActiveObjects: [] as any[],
};

export const canvasEventListenersReducer = (state: typeof initialState, action: CanvasEventListenersAction) => {
  switch (action.type) {
    case "SET_OBSERVED_TEXT_ID":
      return { ...state, observedTextId: action.payload };
    case "SET_OBSERVED_TEXT_CONTENT":
      return { ...state, observedTextContent: action.payload };
    case "SET_RECENTLY_ACTIVE_OBJECTS":
      return { ...state, recentlyActiveObjects: action.payload };
    default:
      return state;
  }
};
