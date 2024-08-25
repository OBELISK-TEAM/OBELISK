import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthAction } from "@/enums/AuthAction";
import { HandleAuthI } from "@/interfaces/handle-auth";
import { useAuthForm } from "./useAuthForm";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { toastAuthorizationResult } from "@/contexts/toastAuthorizationResult";
import { ToastTypes } from "@/enums/ToastType";

export const useHandleAuth = (): HandleAuthI => {
  const authForm = useAuthForm();
  const { email, password, loading, setEmail, setPassword, setLoading } = authForm;
  const { login, signup, logout } = useAuth();
  const { googleAuth } = useGoogleAuth(); //special wrapper for google auth, inside it uses loginGoogleUser from useAuth
  const router = useRouter();

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
              toastAuthorizationResult(ToastTypes.ERROR, errorMessages);
              console.warn(errorMessages);
            } else {
              toastAuthorizationResult(ToastTypes.ERROR, "Unexpected error");
            }
          } catch (err2: any) {
            toastAuthorizationResult(ToastTypes.ERROR, "Unexpected error");
          }
        } finally {
          setLoading(false);
        }
      };
    },
    [email, password, setLoading, login, signup, logout, router, googleAuth]
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
