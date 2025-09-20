import { createClient } from '@/lib/supabase/server';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { FiHeart } from 'react-icons/fi';

interface Product {
  id: number;
  name: string;
  image_url: string | null;
  tag: string | null;
  variants: {
    id: number;
    price: number;
    color: string | null;
    size: string | null;
    image_url: string | null;
  }[];
}

export default async function WishlistPage() {
  const supabase = createClient();
  // This is a server component, so useWishlist cannot be used directly here.
  // We need to fetch all products and then filter them based on the wishlist items from the client.
  // For now, we'll fetch all products and let the client-side filtering happen.
  // A more optimized approach would be to pass the wishlist items from the client to the server.

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url, tag, variants(id, price, color, size, image_url)');

  if (error) {
    console.error('Error fetching products for wishlist:', error);
    return <div>Error loading wishlist.</div>;
  }

  // Client-side component to handle filtering and display
  return <ClientWishlist products={products || []} />;
}

// Client component to use the WishlistContext
'use client';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { FiHeart } from 'react-icons/fi';

interface ClientWishlistProps {
  products: Product[];
}

function ClientWishlist({ products }: ClientWishlistProps) {
  const { wishlistItems } = useWishlist();

  const favoriteProducts = products.filter(product => wishlistItems.includes(product.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tus Productos Favoritos</h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <FiHeart className="mx-auto text-5xl text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-700">No tienes productos en tu lista de favoritos</h2>
          <p className="mt-2 text-gray-500">¡Explora nuestros productos y añade tus favoritos!</p>
          <a href="/" className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors">
            Explorar Productos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
