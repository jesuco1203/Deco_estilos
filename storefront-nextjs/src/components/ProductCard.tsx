"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart, type CartItem } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductTag from "./ProductTag";
import { FiHeart } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  image_url: string | null;
  storage_key: string | null;
  tag: string | null;
  product_images: { storage_key: string }[];
  variants: {
    id: number;
    price: number;
    color: string | null;
    size: string | null;
    image_url: string | null;
  }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWish, isWishlisted } = useWishlist(); // Add this line
  const [isAdded, setIsAdded] = useState(false);

  const src = product.image_url?.trim()
    ? product.image_url
    : "/placeholder-600x600.svg";

  const minPrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : 0;

  const handleAddToCart = () => {
    if (product.variants.length === 0) {
      alert(
        "Este producto no tiene variantes disponibles para añadir al carrito.",
      );
      return;
    }

    // For the main page, we add the first variant by default
    const variantToAdd = product.variants[0];

    const itemToAdd: Omit<CartItem, "quantity"> = {
      id: variantToAdd.id,
      productId: product.id,
      name: product.name,
      price: variantToAdd.price,
      image: variantToAdd.image_url || product.image_url,
      color: variantToAdd.color,
      size: variantToAdd.size,
    };

    addToCart(itemToAdd);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md transition-slow w-full flex flex-col">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/2]">
          <Image
            src={src}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {product.tag && <ProductTag tag={product.tag} />}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating to product page
              toggleWish(product.id);
            }}
            className={`absolute top-2 left-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-colors duration-200 ${
              isWishlisted(product.id)
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
            aria-label="Add to wishlist"
          >
            <FiHeart
              size={20}
              fill={isWishlisted(product.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="p-4 h-28">
          <h3 className="font-medium text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>
          <span className="font-bold text-lg">
            S/ {minPrice > 0 ? minPrice.toFixed(2) : "Consultar"}
          </span>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isAdded || product.variants.length === 0}
          className={`add-to-cart-btn w-full text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ${isAdded ? "bg-teal-500" : "bg-amber-500 hover:bg-amber-600"} disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isAdded ? "¡Añadido!" : "Añadir al Carrito"}
        </button>
      </div>
    </div>
  );
}
