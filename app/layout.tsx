// app/layout.tsx
import type { Metadata } from "next";
import { QueryProvider } from "@/src/presentation/providers/QueryProvider";
import StyledComponentsRegistry from "@/src/presentation/providers/StyledComponentsRegistry";
import { ToastProvider } from "@/src/presentation/providers/ToastProvider";
import { CartWrapper } from "@/src/presentation/components/cart/CartWrapper";
import { Header } from "@/src/presentation/components/layout";
import { Footer } from "@/src/presentation/components/layout";
import { ErrorBoundary } from "@/src/presentation/components/ui/ErrorBoundary";
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
            <ErrorBoundary>
              <Header />
              <main>{children}</main>
              <Footer />
              <CartWrapper />
              <ToastProvider />
            </ErrorBoundary>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}