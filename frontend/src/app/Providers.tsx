"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import MessageReceiver from "@/app/MessageReceiver";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <MessageReceiver>
            {children}
            </MessageReceiver>
        </AuthProvider>
    );
};

export default Providers;
