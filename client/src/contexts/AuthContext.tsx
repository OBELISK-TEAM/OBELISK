import React, { createContext, useContext } from "react";
import { ToastTypes } from "@/enums/ToastType";
import { complexToastContext } from "./ComplexToastContext";
import { AuthContext as IAuthContext } from "@/interfaces/auth-context";
import { toast } from "sonner";
import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";
import {
  register as registerAction,
  login as loginAction,
  logout as logoutAction,
  googleLogin as googleLoginAction,
} from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { getRedirectUrl } from "@/lib/urlUtils";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; decodedToken: DecodedToken | null }> = ({
  children,
  decodedToken,
}) => {
  const router = useRouter();
  const login = async (credentials: { email: string; password: string }) => {
    await loginAction(credentials.email, credentials.password);

    toast.dismiss();
    complexToastContext(ToastTypes.SUCCESS, "Logged in succesfully");
    const redirect = getRedirectUrl() || "/user-boards";
    router.push(redirect);
  };

  const signup = async (credentials: { email: string; password: string }) => {
    await registerAction(credentials.email, credentials.password);
    toast.dismiss();
    complexToastContext(ToastTypes.SUCCESS, "Registered successfully");
    const redirect = getRedirectUrl() || "/user-boards";
    router.push(redirect);
  };

  const logout = async () => {
    await logoutAction();
    toast.dismiss();
    complexToastContext(ToastTypes.SUCCESS, "Logged out successfully");
    router.push("/auth/login");
  };

  const loginGoogleUser = async (userTempId: string) => {
    await googleLoginAction(userTempId);
    toast.dismiss();
    complexToastContext(ToastTypes.SUCCESS, "Logged in with Google successfully");
    const redirect = getRedirectUrl() || "/user-boards";
    router.push(redirect);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        loginGoogleUser,
        decodedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
