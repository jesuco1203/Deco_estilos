'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid

interface WishlistContextType {
  wishlistItems: number[]; // Array of product IDs
  toggleWish: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [anonId, setAnonId] = useState<string | null>(null); // Nuevo estado para anonId

  // Generar o cargar anonId
  useEffect(() => {
    let currentAnonId = localStorage.getItem('decoEstilosAnonId');
    if (!currentAnonId) {
      currentAnonId = uuidv4();
      localStorage.setItem('decoEstilosAnonId', currentAnonId);
    }
    setAnonId(currentAnonId);
  }, []);

  // Cargar wishlist del backend cuando anonId esté disponible
  useEffect(() => {
    if (anonId) {
      const fetchWishlist = async () => {
        try {
          const response = await fetch(`https://qehmrxrrtestgxvqjjze.functions.supabase.co/wishlist/list?anonId=${anonId}`, { credentials: 'include' });
          if (response.ok) {
            const data = await response.json();
            setWishlistItems(data.wishlist || []);
          } else {
            console.error('Failed to fetch wishlist from backend:', response.statusText);
            // Fallback to local storage if backend fails
            const storedWishlist = localStorage.getItem('decoEstilosWishlist');
            if (storedWishlist) {
              setWishlistItems(JSON.parse(storedWishlist));
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          // Fallback to local storage if network error
          const storedWishlist = localStorage.getItem('decoEstilosWishlist');
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist));
          }
        }
      };
      fetchWishlist();
    }
  }, [anonId]);

  // Sincronizar wishlist con localStorage (como fallback y para consistencia)
  useEffect(() => {
    if (anonId) { // Solo guardar en local si ya tenemos un anonId
      localStorage.setItem('decoEstilosWishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, anonId]);


  const toggleWish = async (productId: number) => {
    if (!anonId) {
      console.error('Anon ID not available. Cannot toggle wish.');
      return;
    }

    const isCurrentlyWishlisted = wishlistItems.includes(productId);
    const newWishlistItems = isCurrentlyWishlisted
      ? wishlistItems.filter(id => id !== productId)
      : [...wishlistItems, productId];

    // Optimistic update
    setWishlistItems(newWishlistItems);

    try {
      const response = await fetch('https://qehmrxrrtestgxvqjjze.functions.supabase.co/wishlist/toggle', { credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonId, productId, action: isCurrentlyWishlisted ? 'remove' : 'add' }),
      });

      if (!response.ok) {
        console.error('Failed to sync wishlist with backend:', response.statusText);
        // Revert optimistic update if backend fails
        setWishlistItems(isCurrentlyWishlisted ? [...wishlistItems, productId] : wishlistItems.filter(id => productId !== id));
        alert('Error al actualizar favoritos. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
      // Revert optimistic update if network error
      setWishlistItems(isCurrentlyWishlisted ? [...wishlistItems, productId] : wishlistItems.filter(id => productId !== id));
      alert('Error de conexión al actualizar favoritos. Por favor, inténtalo de nuevo.');
    }
  };

  const isWishlisted = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWish,
        isWishlisted,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};