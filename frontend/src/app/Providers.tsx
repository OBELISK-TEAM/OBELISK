"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { ToasterProps } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const toastsConfig: ToasterProps = {
    position: "bottom-center",
    richColors: true,
    visibleToasts: 5,
    closeButton: true,
  };

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster {...toastsConfig} />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
