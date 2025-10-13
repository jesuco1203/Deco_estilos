"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
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

interface ClientWishlistProps {
  products: Product[];
}

export default function ClientWishlist({ products }: ClientWishlistProps) {
  const { wishlistItems } = useWishlist();

  const favoriteProducts = products.filter((product) =>
    wishlistItems.has(product.id),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tus Productos Favoritos</h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <FiHeart className="mx-auto text-5xl text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-700">
            No tienes productos en tu lista de favoritos
          </h2>
          <p className="mt-2 text-gray-500">
            ¡Explora nuestros productos y añade tus favoritos!
          </p>
          <a
            href="/"
            className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors"
          >
            Explorar Productos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
