"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart, type CartItem } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext"; // Import useWishlist
import { FiHeart } from "react-icons/fi"; // Import heart icon
import { resolveImageSrc, PLACEHOLDER } from "@/lib/images";

// Corrected types based on user's schema
type Variant = {
  id: number;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  storage_key?: string | null;
  color: string | null;
  size: string | null;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  storage_key: string | null;
  product_images: { storage_key: string | null; image_url?: string | null }[];
  variants: Variant[];
};

interface ProductOptionsProps {
  product: Product;
}

// Helper to map color names to hex codes for the swatches
const colorNameToHex: { [key: string]: string } = {
  rojo: "#ef4444",
  azul: "#3b82f6",
  verde: "#22c5e",
  negro: "#111827",
  blanco: "#f9fafb",
  plata: "#d1d5db",
  oro: "#f59e0b",
  dorado: "#f59e0b",
  unica: "#a0aec0", // Asumiendo un gris para "Unica"
  // Add more colors as needed
};

export default function ProductOptions({ product }: ProductOptionsProps) {
  const { addToCart } = useCart();
  const { toggleWish, isWishlisted } = useWishlist(); // Add this line
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.color || null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size || null,
  );

  const uniqueColors = useMemo(() => {
    const colors = new Map<string, string>();
    product.variants.forEach((v) => {
      if (v.color && !colors.has(v.color)) {
        colors.set(v.color, colorNameToHex[v.color.toLowerCase()] || "#d1d5db"); // Fallback to gray
      }
    });
    return Array.from(colors.entries());
  }, [product.variants]);

  const availableSizesForSelectedColor = useMemo(() => {
    return [
      ...new Set(
        product.variants
          .filter((v) => v.color === selectedColor && v.size)
          .map((v) => v.size!),
      ),
    ];
  }, [product.variants, selectedColor]);

  useEffect(() => {
    if (selectedColor) {
      const firstAvailableSize = availableSizesForSelectedColor[0];
      if (firstAvailableSize) {
        const isCurrentSizeAvailable = availableSizesForSelectedColor.includes(
          selectedSize!,
        );
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
      return product.variants.find((v) => v.color === selectedColor);
    }
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize,
    );
  }, [
    product.variants,
    selectedColor,
    selectedSize,
    availableSizesForSelectedColor,
  ]);

  const featuredImage = useMemo(() => {
    const galleryImage = product.product_images?.find((img) =>
      Boolean(resolveImageSrc(img)),
    );
    return (
      resolveImageSrc({
        storage_key: galleryImage?.storage_key ?? product.storage_key,
        image_url: galleryImage?.image_url ?? product.image_url,
      }) ?? null
    );
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const variantImage = resolveImageSrc({
      storage_key: selectedVariant?.storage_key ?? null,
      image_url: selectedVariant?.image_url ?? null,
    });
    const fallbackProductImage = resolveImageSrc({
      storage_key: product.storage_key ?? null,
      image_url: product.image_url ?? null,
    });

    const imageForCart =
      variantImage ?? featuredImage ?? fallbackProductImage ?? PLACEHOLDER;

    const itemToAdd: Omit<CartItem, "quantity"> = {
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: imageForCart,
      color: selectedVariant.color,
      size: selectedVariant.size,
    };

    addToCart(itemToAdd);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const variantImage = selectedVariant
    ? resolveImageSrc({
        storage_key: selectedVariant?.storage_key ?? null,
        image_url: selectedVariant?.image_url ?? null,
      })
    : null;

  const fallbackProductImage = resolveImageSrc({
    storage_key: product.storage_key ?? null,
    image_url: product.image_url ?? null,
  });

  const mainImage =
    variantImage ?? featuredImage ?? fallbackProductImage ?? PLACEHOLDER;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[ProductOptions] Loaded product", {
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        storage_key: product.storage_key,
        product_images: product.product_images,
      });
    }
  }, [product]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[ProductOptions] Image resolution", {
        featuredImage,
        variantImage,
        fallbackProductImage,
        mainImage,
        selectedVariant,
      });
    }
  }, [featuredImage, variantImage, fallbackProductImage, mainImage, selectedVariant]);

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: Image Gallery */}
      <div>
        <div className="relative bg-gray-100 rounded-lg mb-4 aspect-square">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Right Column: Product Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          <button
            onClick={() => toggleWish(product.id)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isWishlisted(product.id)
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
            aria-label="Add to wishlist"
          >
            <FiHeart
              size={28}
              fill={isWishlisted(product.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {product.description}
        </p>

        {uniqueColors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-lg">
              Color:{" "}
              <span className="font-normal capitalize">{selectedColor}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map(([name, hex]) => (
                <button
                  key={name}
                  onClick={() => setSelectedColor(name)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 ${selectedColor === name ? "border-amber-500 scale-110" : "border-gray-200"}`}
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
              {availableSizesForSelectedColor.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${selectedSize === size ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-3xl font-bold mb-6">
          {selectedVariant
            ? `S/ ${selectedVariant.price.toFixed(2)}`
            : "Selecciona las opciones"}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAdded}
          className={`w-full text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ${isAdded ? "bg-teal-500" : "bg-amber-500 hover:bg-amber-600"} disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isAdded ? "¡Añadido al carrito!" : "Añadir al Carrito"}
        </button>
      </div>
    </div>
  );
}
