"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ChatbotProvider } from "./context/ChatbotContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
      <SessionProvider>
        <ChatbotProvider>{children}</ChatbotProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}