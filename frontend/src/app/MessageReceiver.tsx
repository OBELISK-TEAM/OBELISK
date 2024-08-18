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
          className={`fixed top-2 z-50 mt-2 w-[80%] max-w-lg -translate-x-1/2 transform rounded-md p-4 shadow-lg transition-all duration-500 ${
            visible ? "slide-down" : "slide-up"
          } ${
            authMessage.type === "SUCCESS" ? "border bg-green-100 text-green-700" : "border bg-red-100 text-red-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{authMessage.message}</span>
            <button
              onClick={() => setVisible(false)}
              className={`ml-4 cursor-pointer border-none bg-transparent text-lg font-semibold ${
                authMessage.type === "SUCCESS"
                  ? "text-green-700 hover:text-green-900"
                  : "text-red-500 hover:text-red-700"
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
