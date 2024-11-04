export type BoardNameFieldAction =
  | { type: "SET_NAME"; payload: { name: string; isValid: boolean } }
  | { type: "START_EDITING" }
  | { type: "CANCEL_EDITING"; payload: string }
  | { type: "START_UPDATING" }
  | { type: "FINISH_UPDATING_ERROR" }
  | { type: "FINISH_UPDATING_SUCCESS" }
  | { type: "SET_NAME_FROM_BOARD"; payload: string };
