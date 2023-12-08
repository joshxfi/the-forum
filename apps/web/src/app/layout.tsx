import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Menu } from "@/components/menu";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/context/NextAuthProvider";

import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Forum",
  description: "A true open space for lozol bcd.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-screen-sm mx-auto`}>
        <NextAuthProvider>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <Navbar />
          <ApolloWrapper>
            {children}
            <Menu />
          </ApolloWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
