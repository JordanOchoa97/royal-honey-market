// app/layout.tsx

import type { Metadata } from "next";
import { QueryProvider } from "@/src/presentation/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Honey - Premium Honey Products",
  description: "Discover premium organic honey and bee products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}