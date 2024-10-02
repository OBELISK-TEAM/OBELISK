"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ToasterWrapper from "@/providers/ToasterWrapper";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterWrapper />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
