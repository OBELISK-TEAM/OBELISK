"use client";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import MessageReceiver from "@/app/MessageReceiver";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MessageReceiver>{children}</MessageReceiver>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
