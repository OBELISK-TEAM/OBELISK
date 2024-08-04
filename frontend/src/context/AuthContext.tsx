import React, {createContext, useContext, useReducer} from "react";
import {AuthMessage} from "@/interfaces/auth-message";
import {AuthActionType, AuthMessageType} from "@/enums/AuthMessage";
import {jwtDecode} from "jwt-decode";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

interface AuthContextType {
    getAuthMessage: () => AuthMessage | null;
    setAuthAction: (actionType: AuthActionType, token?: string) => void;
    getToken: () => string | null;
    clearAuthMessage: () => void;
    isTokenValid: () => boolean;
    authRedirect: ({redirectPath,fallbackPath}:{redirectPath: string, fallbackPath: string}) => void;
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
   const router = useRouter();
    const getToken = () => {
        return Cookies.get("token") || null;
    };

    const setToken = (newToken: string) => {
        try {
            const decoded: any = jwtDecode(newToken);
            const expiryDate = new Date(decoded.exp * 1000);

            Cookies.set("token", newToken, { expires: expiryDate });
        } catch (error) {
            console.error('Invalid token:', error);
        }
    };

    const clearToken = () => {
        Cookies.remove("token");
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

    const isTokenValid = (): boolean => {
        const token = getToken();
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            return decoded.exp && decoded.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    };

    const authRedirect = ({ redirectPath, fallbackPath }: { redirectPath: string, fallbackPath: string }) => {
        if (isTokenValid()) {
            router.push(redirectPath);
        } else {
            router.push(fallbackPath);
        }
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
        <AuthContext.Provider value={{ getAuthMessage,getToken, setAuthAction,clearAuthMessage,authRedirect,isTokenValid }}>
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
