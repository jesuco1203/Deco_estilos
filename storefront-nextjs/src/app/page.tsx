import { createClient } from "@/lib/supabase/server";
import HomePageContent from "./HomePageContent";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, storage_key, variants(*), product_images(storage_key)");

  if (error) {
    console.error("Error fetching products in HomePage:", error);
    // Handle the error appropriately
  }

  // Ensure the data is a plain object before passing it to the Client Component
  const plainProducts = JSON.parse(JSON.stringify(products || []));

  return <HomePageContent products={plainProducts} />;
}
