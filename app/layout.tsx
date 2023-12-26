import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import QueryProviders from "@/providers/query-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpreadIt",
  description:
    "SpreadIt is a dynamic social news aggregation platform powered by robust backend technologies and a user-friendly interface. It employs modern web development frameworks and scalable architecture to enable seamless content submission, sharing, and voting across various formats (articles, images, videos).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark antialiased", inter.className)}
    >
      <body
        className="min-h-screen pt-12 antialiased"
        suppressHydrationWarning
      >
        <QueryProviders>
          <Toaster />

          {children}
        </QueryProviders>
      </body>
    </html>
  );
}
