"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ToasterWrapper from "@/providers/ToasterProvider";
import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";

const AppProviders = ({ children, decodedToken }: { children: React.ReactNode; decodedToken: DecodedToken | null }) => {
  return (
    <AuthProvider decodedToken={decodedToken}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterWrapper />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
