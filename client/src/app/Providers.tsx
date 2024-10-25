"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ToasterWrapper from "@/providers/ToasterWrapper";
import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";

const Providers = ({ children, decodedToken }: { children: React.ReactNode; decodedToken: DecodedToken | null }) => {
  return (
    <AuthProvider decodedToken={decodedToken}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterWrapper />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
