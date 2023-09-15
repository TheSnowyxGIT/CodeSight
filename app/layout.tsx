"use client";
import { NavBar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import "@/theme/globals.css";
import theme from "@/theme/theme";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <ThemeProvider theme={theme}>
        <body className={`${inter.className} dark`}>
          <div className="relative min-h-screen flex flex-col">
            <NavBar />
            {children}
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
