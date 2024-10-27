import React, { createContext, useContext } from "react";
import { ToastTypes } from "@/enums/ToastType";
import { complexToast } from "./complexToast";
import { AuthContext as IAuthContext } from "@/interfaces/auth-context";
import { toast } from "sonner";
import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";
import {
  register as registerAction,
  login as loginAction,
  logout as logoutAction,
  googleLogin as googleLoginAction,
} from "@/app/actions/authActions";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; decodedToken: DecodedToken | null }> = ({
  children,
  decodedToken,
}) => {
  const login = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    await loginAction(credentials.email, credentials.password);
    toast.dismiss();
    complexToast(ToastTypes.SUCCESS, "Logged in succesfully");
    window.location.href = successRedirect || "/user-boards";
  };

  const signup = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    await registerAction(credentials.email, credentials.password);
    toast.dismiss();
    complexToast(ToastTypes.SUCCESS, "Registered successfully");
    window.location.href = successRedirect || "/user-boards";
  };

  const logout = async (successRedirect?: string) => {
    await logoutAction();
    toast.dismiss();
    complexToast(ToastTypes.SUCCESS, "Logged out successfully");
    window.location.href = successRedirect || "/auth/login";
  };

  const loginGoogleUser = async (userTempId: string, successRedirect?: string) => {
    await googleLoginAction(userTempId);
    toast.dismiss();
    complexToast(ToastTypes.SUCCESS, "Logged in with Google successfully");
    window.location.href = successRedirect || "/user-boards";
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
