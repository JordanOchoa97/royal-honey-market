// app/layout.tsx
import type { Metadata } from "next";
import { QueryProvider } from "@/src/presentation/providers/QueryProvider";
import StyledComponentsRegistry from "@/src/presentation/providers/StyledComponentsRegistry";
import { CartWrapper } from "@/src/presentation/components/cart/CartWrapper";
import { Header } from "@/src/presentation/components/layout";
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
        <StyledComponentsRegistry>
          <QueryProvider>
            <Header />
            {children}
            <CartWrapper />
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}