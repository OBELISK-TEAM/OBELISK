import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthAction } from "@/enums/AuthAction";
import { HandleAuth } from "@/interfaces/handle-auth";
import { useAuthForm } from "./useAuthForm";

export const useHandleAuth = (): HandleAuth => {
  const authForm = useAuthForm();
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    setError,
    setLoading,
  } = authForm;
  const { login, signup, logout } = useAuth();
  const router = useRouter();

  const handleAuth = useCallback(
    (authFunc: AuthAction, successRedirect?: string) => {
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
            default:
              throw new Error("Invalid authentication action");
          }
          if (successRedirect) {
            router.push(successRedirect);
          }
        } catch (err: any) {
          if (err instanceof Error) {
            const errorMessages = JSON.parse(err.message) as string[];
            setError(errorMessages);
          } else {
            setError(["Unexpected error occurred."]);
          }
        } finally {
          setLoading(false);
        }
      };
    },
    [email, password, setError, setLoading, login, signup, logout, router],
  );

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    setError,
    setLoading,
    login: handleAuth(AuthAction.LOGIN, "/user-boards"),
    signup: handleAuth(AuthAction.SIGNUP, "/user-boards"),
    logout: handleAuth(AuthAction.LOGOUT),
  };
};
