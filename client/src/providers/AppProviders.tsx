"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ToasterWrapper from "@/providers/ToasterProvider";
import { User } from "@/interfaces/user/user";

const AppProviders = ({ children, userInfo }: { children: React.ReactNode; userInfo: User | null }) => {
  return (
    <AuthProvider userInfo={userInfo}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterWrapper />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
