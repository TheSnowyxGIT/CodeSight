"use client";
import { NavBar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import "@/theme/globals.css";
import "prismjs/themes/prism-tomorrow.css"; // Choose a theme that you like
import Prism from "prismjs";
import theme from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
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
