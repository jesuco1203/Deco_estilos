'use client';

import { UIProvider } from '@/context/UIContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext'; // Import WishlistProvider
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </UIProvider>
  );
}
