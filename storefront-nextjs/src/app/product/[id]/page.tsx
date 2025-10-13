import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductOptions from "@/components/ProductOptions";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProductPage(props: Props) {
  const id = props.params.id; // Access id here
  const supabase = await createClient();
  // Fetch product and its variants.
  // The join with colors and sizes might need adjustment based on actual table names.
  const { data: product, error } = await supabase
    .from("products")
    .select("*, storage_key, variants(*), product_images(storage_key)")
    .eq("id", id)
    .single();

  if (error || !product) {
    console.error(`Error fetching product with id ${id}:`, error);
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProductOptions product={product} />
    </div>
  );
}
