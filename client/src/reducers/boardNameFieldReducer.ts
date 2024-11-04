import { BoardNameFieldAction } from "@/types/BoardNameField/BoardNameFieldAction";
import { BoardNameFieldState } from "@/types/BoardNameField/BoardNameFieldState";

export const boardNameFieldReducer = (
  state: BoardNameFieldState,
  action: BoardNameFieldAction
): BoardNameFieldState => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload.name, isEnabledConfirmButton: action.payload.isValid };
    case "START_EDITING":
      return { ...state, isEditing: true };
    case "CANCEL_EDITING":
      return { ...state, isEditing: false, name: action.payload };
    case "START_UPDATING":
      return { ...state, updating: true };
    case "FINISH_UPDATING_ERROR":
      return { ...state, updating: false };
    case "FINISH_UPDATING_SUCCESS":
      return { ...state, updating: false, isEditing: false };
    case "SET_NAME_FROM_BOARD":
      return { ...state, name: action.payload };
    default:
      return state;
  }
};
