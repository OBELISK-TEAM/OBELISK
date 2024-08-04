                //
                // <div
                //     className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 w-full max-w-md p-4 rounded-md shadow-lg ${
                //         authMessage.type === "SUCCESS"
                //             ? "bg-green-100 border-green-500 text-green-700"
                //             : "bg-red-100 border-red-500 text-red-700"
                //
                //
                //

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const MessageReceiver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getAuthMessage, clearAuthMessage } = useAuth();
    const authMessage = getAuthMessage();
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (authMessage) {
            setVisible(true);
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    clearAuthMessage();
                }, 500);
            }, 5000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [authMessage, clearAuthMessage]);

    return (
        <div>
            {authMessage && (
                <div
                    className={`fixed top-2  transform -translate-x-1/2  mt-2 z-50 w-[80%] max-w-lg p-4 rounded-md shadow-lg transition-all duration-500 ${
                        visible ? "slide-down" : "slide-up"
                    } ${
                        authMessage.type === "SUCCESS"
                            ? "bg-green-100 border text-green-700"
                            : "bg-red-100 border text-red-700"
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">{authMessage.message}</span>
                        <button
                            onClick={() => setVisible(false)}
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
