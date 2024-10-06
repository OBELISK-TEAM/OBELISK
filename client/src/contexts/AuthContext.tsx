import React, { createContext, useContext } from "react";
import { ToastTypes } from "@/enums/ToastType";
import { useRouter } from "next/navigation";
import { complexToast } from "./complexToast";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { AuthContext as IAuthContext } from "@/interfaces/auth-context";
import { toast } from "sonner";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      toast.dismiss();
      complexToast(ToastTypes.SUCCESS, "Logged in succesfully");
      router.push(successRedirect || "/user-boards");
    } else {
      const reasons = await extractMessagesFromApiError(response);
      complexToast(ToastTypes.ERROR, reasons);
    }
  };

  const signup = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      toast.dismiss();
      complexToast(ToastTypes.SUCCESS, "Registered successfully");
      router.push(successRedirect || "/user-boards");
    } else {
      const reasons = await extractMessagesFromApiError(response);
      complexToast(ToastTypes.ERROR, reasons, { duration: Infinity });
    }
  };

  const logout = async (successRedirect?: string) => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      toast.dismiss();
      complexToast(ToastTypes.SUCCESS, "Logged out successfully");
      router.push(successRedirect || "/auth/login");
    } else {
      const reasons = await extractMessagesFromApiError(response);
      complexToast(ToastTypes.ERROR, reasons);
    }
  };

  const loginGoogleUser = async (userTempId: string, successRedirect?: string) => {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: userTempId }),
    });

    if (response.ok) {
      toast.dismiss();
      complexToast(ToastTypes.SUCCESS, "Logged in with Google successfully");
      router.push(successRedirect || "/user-boards");
    } else {
      const reasons = await extractMessagesFromApiError(response);
      complexToast(ToastTypes.ERROR, reasons);
      await extractMessagesFromApiError(response);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        loginGoogleUser,
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
