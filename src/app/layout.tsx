import ThemeToggle from "@/components/themeToggle";
import { ThemeProvider, RoleProvider } from "@/provider/Provider";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neswara",
  description: "Neswara Admin Dashboard",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background dark:bg-darkBackground text-text dark:text-darkText`}>
        <ThemeProvider>
          <RoleProvider>
            {children}
            <ThemeToggle />
            <Toaster position="top-right" />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
