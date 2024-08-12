import { useReducer, useCallback } from "react";
import { AuthAction, AuthState } from "@/interfaces/auth-form";

export const initialState: AuthState = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const useAuthForm = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setEmail = useCallback((email: string) => {
    dispatch({ type: "SET_EMAIL", payload: email });
  }, []);

  const setPassword = useCallback((password: string) => {
    dispatch({ type: "SET_PASSWORD", payload: password });
  }, []);

  const setError = useCallback((error: string[] | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    setEmail,
    setPassword,
    setError,
    setLoading,
    resetForm,
  };
};
