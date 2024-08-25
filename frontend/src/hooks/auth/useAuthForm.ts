import { useReducer, useCallback } from "react";
import { AuthStateI } from "@/interfaces/auth-form";
import { AuthAction } from "@/types/AuthActionReducer";

export const initialState: AuthStateI = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

const authReducer = (state: AuthStateI, action: AuthAction): AuthStateI => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
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
    setLoading,
    resetForm,
  };
};
