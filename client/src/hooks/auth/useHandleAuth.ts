import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthAction } from "@/enums/AuthAction";
import { HandleAuth } from "@/interfaces/handle-auth";
import { useAuthForm } from "./useAuthForm";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import logger from "@/lib/logger";

export const useHandleAuth = (): HandleAuth => {
  const authForm = useAuthForm();
  const { email, password, loading, setEmail, setPassword, setLoading } = authForm;
  const { login, signup, logout } = useAuth();
  const { googleAuth } = useGoogleAuth(); //special wrapper for google auth, inside it uses loginGoogleUser from useAuth

  const handleAuth = useCallback(
    (authFunc: AuthAction) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
          switch (authFunc) {
            case AuthAction.LOGIN:
              await login({ email, password });
              break;
            case AuthAction.SIGNUP:
              await signup({ email, password });
              break;
            case AuthAction.LOGOUT:
              await logout();
              break;
            case AuthAction.GOOGLE_LOGIN:
              await googleAuth();
              break;
            default:
              throw new Error("Invalid authentication action");
          }
        } catch (err: any) {
          try {
            if (err instanceof Error) {
              const errorMessages = JSON.parse(err.message) as string[];
              complexToast(ToastTypes.ERROR, errorMessages);
              logger.error(errorMessages);
            } else {
              complexToast(ToastTypes.ERROR, "Unexpected error");
            }
          } catch (err2: any) {
            complexToast(ToastTypes.ERROR, "Unexpected error");
          }
        } finally {
          setLoading(false);
        }
      };
    },
    [email, password, setLoading, login, signup, logout, googleAuth]
  );

  return {
    email,
    password,
    loading,
    setEmail,
    setPassword,
    setLoading,
    login: handleAuth(AuthAction.LOGIN),
    signup: handleAuth(AuthAction.SIGNUP),
    logout: handleAuth(AuthAction.LOGOUT),
    googleAuth: handleAuth(AuthAction.GOOGLE_LOGIN),
  };
};
