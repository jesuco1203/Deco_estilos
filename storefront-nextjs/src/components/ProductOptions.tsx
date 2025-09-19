'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCart, type CartItem } from '@/context/CartContext';

// Corrected types based on user's schema
type Variant = {
  id: number;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  color: string | null;
  size: string | null;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  variants: Variant[];
};

interface ProductOptionsProps {
  product: Product;
}

// Helper to map color names to hex codes for the swatches
const colorNameToHex: { [key: string]: string } = {
  'rojo': '#ef4444',
  'azul': '#3b82f6',
  'verde': '#22c5e',
  'negro': '#111827',
  'blanco': '#f9fafb',
  'plata': '#d1d5db',
  'oro': '#f59e0b',
  'dorado': '#f59e0b',
  'unica': '#a0aec0', // Asumiendo un gris para "Unica"
  // Add more colors as needed
};

export default function ProductOptions({ product }: ProductOptionsProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.variants[0]?.color || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variants[0]?.size || null);

  const uniqueColors = useMemo(() => {
    const colors = new Map<string, string>();
    product.variants.forEach(v => {
      if (v.color && !colors.has(v.color)) {
        colors.set(v.color, colorNameToHex[v.color.toLowerCase()] || '#d1d5db'); // Fallback to gray
      }
    });
    return Array.from(colors.entries());
  }, [product.variants]);

  const availableSizesForSelectedColor = useMemo(() => {
    return [...new Set(product.variants
      .filter(v => v.color === selectedColor && v.size)
      .map(v => v.size!))];
  }, [product.variants, selectedColor]);

  useEffect(() => {
    if (selectedColor) {
      const firstAvailableSize = availableSizesForSelectedColor[0];
      if (firstAvailableSize) {
        const isCurrentSizeAvailable = availableSizesForSelectedColor.includes(selectedSize!);
        if (!isCurrentSizeAvailable) {
          setSelectedSize(firstAvailableSize);
        }
      } else {
        setSelectedSize(null);
      }
    }
  }, [selectedColor, availableSizesForSelectedColor, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (availableSizesForSelectedColor.length === 0 && selectedColor) {
      return product.variants.find(v => v.color === selectedColor);
    }
    return product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
  }, [product.variants, selectedColor, selectedSize, availableSizesForSelectedColor]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const itemToAdd: Omit<CartItem, 'quantity'> = {
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: selectedVariant.image_url || product.image_url,
      color: selectedVariant.color,
      size: selectedVariant.size,
    };

    addToCart(itemToAdd);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const mainImage = selectedVariant?.image_url || product.image_url || 'https://placehold.co/600x600';

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: Image Gallery */}
      <div>
        <div className="bg-gray-100 rounded-lg mb-4">
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg aspect-square"
          />
        </div>
      </div>

      {/* Right Column: Product Info */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

        {uniqueColors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-lg">Color: <span className="font-normal capitalize">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map(([name, hex]) => (
                <button 
                  key={name} 
                  onClick={() => setSelectedColor(name)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 ${selectedColor === name ? 'border-amber-500 scale-110' : 'border-gray-200'}`}
                  style={{ backgroundColor: hex }}
                  title={name}
                />
              ))}
            </div>
          </div>
        )}

        {availableSizesForSelectedColor.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-lg">Tamaño:</h3>
            <div className="flex flex-wrap gap-3">
              {availableSizesForSelectedColor.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${selectedSize === size ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-3xl font-bold mb-6">
          {selectedVariant ? `S/ ${selectedVariant.price.toFixed(2)}` : 'Selecciona las opciones'}
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAdded}
          className={`w-full text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ${isAdded ? 'bg-teal-500' : 'bg-amber-500 hover:bg-amber-600'} disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isAdded ? '¡Añadido al carrito!' : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  );
}