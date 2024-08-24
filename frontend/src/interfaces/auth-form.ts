export interface AuthState {
  email: string;
  password: string;
  error: string[] | null;
  loading: boolean;
}

export type AuthAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };
