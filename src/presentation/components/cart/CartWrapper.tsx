// src/presentation/components/cart/CartWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

// Cargar CartDrawer solo en el cliente (SSR: false)
const CartDrawer = dynamic(
  () => import('./CartDrawer').then(mod => ({ default: mod.CartDrawer })),
  { ssr: false }
);

export function CartWrapper() {
  return <CartDrawer />;
}