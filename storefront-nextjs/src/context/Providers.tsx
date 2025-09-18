'use client';

import { UIProvider } from '@/context/UIContext';
import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UIProvider>
  );
}
