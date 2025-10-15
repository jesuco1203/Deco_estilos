import { createClient } from "@/lib/supabase/server";
import HomePageContent from "./HomePageContent";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, description, category, tag, image_url, storage_key, product_images(storage_key), variants(id, price, color, size, image_url, stock_quantity)",
    );

  if (error) {
    console.error("Error fetching products in HomePage:", error);
    // Handle the error appropriately
  }

  // Ensure the data is a plain object before passing it to the Client Component
  const plainProducts = JSON.parse(JSON.stringify(products || []));

  return <HomePageContent products={plainProducts} />;
}
