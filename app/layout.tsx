// app/layout.tsx
import type { Metadata } from "next";
import { QueryProvider } from "@/src/presentation/providers/QueryProvider";
import { CartWrapper } from "@/src/presentation/components/cart/CartWrapper";
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
          <CartWrapper />
        </QueryProvider>
      </body>
    </html>
  );
}