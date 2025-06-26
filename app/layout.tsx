import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/next-themes";

const sfPro = localFont({
  src: [
    {
      path: "../public/fonts/sfpro/SFPRODISPLAYREGULAR.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/sfpro/SFPRODISPLAYMEDIUM.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/sfpro/SFPRODISPLAYBOLD.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/sfpro/SFPRODISPLAYLIGHTITALIC.woff",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-sfpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "fixyourspend",
  description: "Still Your Financial Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sfPro.variable} ${sfPro.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
