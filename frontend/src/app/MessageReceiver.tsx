import React from "react";
import { useAuth } from "@/context/AuthContext";

const MessageReceiver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getAuthMessage, clearAuthMessage } = useAuth();
    const authMessage = getAuthMessage();

    return (
        <div>
            {authMessage && (
                <div
                    className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 w-full max-w-md p-4 rounded-md shadow-lg ${
                        authMessage.type === "SUCCESS"
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-red-100 border-red-500 text-red-700"
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span>{authMessage.message}</span>
                        <button
                            onClick={clearAuthMessage}
                            className={`ml-4 bg-transparent border-none text-lg font-semibold cursor-pointer ${
                                authMessage.type === "SUCCESS" ? "text-green-700 hover:text-green-900" : "text-red-500 hover:text-red-700"
                            }`}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default MessageReceiver;
