export type CanvasEventListenersAction =
  | { type: "SET_OBSERVED_TEXT_ID"; payload: string | undefined }
  | { type: "SET_OBSERVED_TEXT_CONTENT"; payload: string | undefined }
  | { type: "SET_RECENTLY_ACTIVE_OBJECTS"; payload: any[] };
