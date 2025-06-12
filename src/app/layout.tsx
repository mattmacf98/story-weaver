import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoryWeaverProvider } from "@/contexts/StoryWeaverContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastMessageProvider } from "@/contexts/ToastMessageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Story Weaver",
  description: "Story Weaver is a tool that helps you create stories.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <StoryWeaverProvider>
            <ToastMessageProvider>
              {children}
            </ToastMessageProvider>
          </StoryWeaverProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
