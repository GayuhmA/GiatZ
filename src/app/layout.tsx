import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GiatZ - Productivity Tools for Gen Z",
  description: "Level up your productivity with GiatZ.",
};

import AuthProvider from "@/components/providers/AuthProvider";
import OrbitEngine from "@/components/providers/OrbitEngine";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          <OrbitEngine />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
