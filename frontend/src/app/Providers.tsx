"use client";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import MessageReceiver from "@/app/MessageReceiver";
import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MessageReceiver>{children}</MessageReceiver>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
