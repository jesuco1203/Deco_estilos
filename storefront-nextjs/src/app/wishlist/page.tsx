import { createClient } from "@/lib/supabase/server";
import ClientWishlist from "./ClientWishlist"; // Import the new Client Component

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

export default async function WishlistPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, image_url, storage_key, tag, product_images(storage_key), variants(id, price, color, size, image_url)",
    );

  if (error) {
    console.error("Error fetching products for wishlist:", error);
    return <div>Error loading wishlist.</div>;
  }

  return <ClientWishlist products={products || []} />;
}
