import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { ApolloWrapper } from "@/lib/ApolloWrapper";

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
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />
        <Toaster />
        <Navbar />
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
