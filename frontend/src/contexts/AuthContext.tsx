import React, { createContext, useContext, useReducer } from "react";
import { AuthMessage } from "@/interfaces/auth-message";
import { AuthActionType, AuthMessageType } from "@/enums/AuthMessage";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/utils/handleApiError";

interface AuthContextType {
  getAuthMessage: () => AuthMessage | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthMessage: () => void;
  loginGoogleUser: (userTempId: string) => Promise<void>;
}

const authMessageReducer = (state: AuthMessage | null, action: AuthActionType): AuthMessage | null => {
  switch (action) {
    case AuthActionType.LOGIN_SUCCESS:
      return { type: AuthMessageType.SUCCESS, message: "Login successful" };
    case AuthActionType.LOGIN_FAILURE:
      return { type: AuthMessageType.FAILURE, message: "Login failed" };
    case AuthActionType.REGISTER_SUCCESS:
      return {
        type: AuthMessageType.SUCCESS,
        message: "Registration successful",
      };
    case AuthActionType.AUTH_ERROR:
      return { type: AuthMessageType.FAILURE, message: "Authentication error" };
    case AuthActionType.REGISTER_FAILURE:
      return { type: AuthMessageType.FAILURE, message: "Registration failed" };
    case AuthActionType.LOGOUT_SUCCESS:
      return { type: AuthMessageType.SUCCESS, message: "Logout successful" };
    case AuthActionType.LOGOUT_FAILURE:
      return { type: AuthMessageType.FAILURE, message: "Logout failed" };
    case AuthActionType.AUTH_CLEAR:
    default:
      return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMessage, dispatch] = useReducer(authMessageReducer, null);
  const router = useRouter();

  const getAuthMessage = () => {
    return authMessage;
  };

  const clearAuthMessage = () => {
    dispatch(AuthActionType.AUTH_CLEAR);
  };

  const login = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      dispatch(AuthActionType.LOGIN_SUCCESS);
      router.push(successRedirect || "/user-boards");
    } else {
      dispatch(AuthActionType.LOGIN_FAILURE);
      await handleApiError(response);
    }
  };

  const signup = async (credentials: { email: string; password: string }, successRedirect?: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      dispatch(AuthActionType.REGISTER_SUCCESS);
      router.push(successRedirect || "/user-boards");
    } else {
      dispatch(AuthActionType.REGISTER_FAILURE);
      await handleApiError(response);
    }
  };

  const logout = async (successRedirect?: string) => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      dispatch(AuthActionType.LOGOUT_SUCCESS);
      router.push(successRedirect || "/auth/login");
    } else {
      dispatch(AuthActionType.LOGOUT_FAILURE);
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
      dispatch(AuthActionType.LOGIN_SUCCESS);
      router.push(successRedirect || "/user-boards");
    } else {
      dispatch(AuthActionType.LOGIN_FAILURE);
      await handleApiError(response);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getAuthMessage,
        login,
        signup,
        logout,
        clearAuthMessage,
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
