'use client';

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(
  () => import('./CartDrawer').then(mod => ({ default: mod.CartDrawer })),
  { ssr: false }
);

export function CartWrapper() {
  return <CartDrawer />;
}