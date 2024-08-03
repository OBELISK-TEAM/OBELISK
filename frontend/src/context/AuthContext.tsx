import React, {createContext, useContext, useReducer} from "react";
import {AuthMessage} from "@/interfaces/auth-message";
import {AuthActionType, AuthMessageType} from "@/enums/AuthMessage";

interface AuthContextType {
    getAuthMessage: () => AuthMessage | null;
    setAuthAction: (actionType: AuthActionType, token?: string) => void;
    getToken: () => string | null;
    clearAuthMessage: () => void;
}

const authMessageReducer = (state: AuthMessage | null, action: AuthActionType): AuthMessage | null => {
    switch (action) {
        case AuthActionType.LOGIN_SUCCESS:
            return { type: AuthMessageType.SUCCESS, message: "Login successful" };
        case AuthActionType.LOGIN_FAILURE:
            return { type: AuthMessageType.FAILURE, message: "Login failed" };
        case AuthActionType.REGISTER_SUCCESS:
            return { type: AuthMessageType.SUCCESS, message: "Registration successful" };
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
    const getToken = () => {
        return localStorage.getItem("token");
    };

    const setToken = (newToken: string) => {
        localStorage.setItem("token", newToken);
    };

    const clearToken = () => {
        localStorage.removeItem("token");
    };
    const getAuthMessage = () => {
        return authMessage;
    };

    const setAuthMessage = (actionType: AuthActionType) => {
        dispatch(actionType);
    };

    const clearAuthMessage = () => {
        dispatch(AuthActionType.AUTH_CLEAR);
    };

    const setAuthAction = (actionType: AuthActionType, token?: string) => {
        switch (actionType) {
            case AuthActionType.LOGIN_SUCCESS:
            case AuthActionType.REGISTER_SUCCESS:
                if (token) {
                    setToken(token);
                    setAuthMessage(actionType);
                } else{
                    setAuthMessage(AuthActionType.AUTH_ERROR);
                }
                break;
            case AuthActionType.LOGIN_FAILURE:
            case AuthActionType.REGISTER_FAILURE:
            case AuthActionType.LOGOUT_FAILURE:
                setAuthMessage(actionType);
                break;
            case AuthActionType.LOGOUT_SUCCESS:
                clearToken();
                setAuthMessage(actionType);
                break;
            default:
                clearAuthMessage();
        }
    };

    return (
        <AuthContext.Provider value={{ getAuthMessage,getToken, setAuthAction,clearAuthMessage }}>
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
