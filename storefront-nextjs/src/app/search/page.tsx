import { createClient } from "@/lib/supabase/server";
import SearchResults from "./SearchResults";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient();
  const searchTerm = (searchParams.q as string) || "";
  const category = (searchParams.category as string) || "";
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : (searchParams.page as string | undefined);
  const parsedPage = Number(pageParam);
  const initialPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.floor(parsedPage)
      : 1;

  // Normalize search term to be accent-insensitive, including 'ñ'
  const normalizedSearchTerm = searchTerm
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  let query = supabase
    .from("products")
    .select(
      "id, name, description, category, tag, image_url, storage_key, product_images(storage_key), variants(id, price, color, size, image_url, stock_quantity)",
    );

  if (normalizedSearchTerm) {
    query = query.or(
      `name.ilike.%${normalizedSearchTerm}%,description.ilike.%${normalizedSearchTerm}%`,
    );
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products in SearchPage:", error);
    // You might want to show an error message to the user
    return <div>Error al buscar productos.</div>;
  }

  // Ensure the data is a plain object before passing it to the Client Component
  const plainProducts = JSON.parse(JSON.stringify(products || []));

  return (
    <SearchResults
      products={plainProducts}
      searchTerm={searchTerm}
      category={category}
      initialPage={initialPage}
    />
  );
}
