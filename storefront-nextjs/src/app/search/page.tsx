import { createClient } from '@/lib/supabase/server';
import SearchResults from './SearchResults';

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const supabase = await createClient();
  const searchTerm = searchParams.q as string || '';

  // Normalize search term to be accent-insensitive, including 'ñ'
  const normalizedSearchTerm = searchTerm.normalize('NFD').replace(/\p{Diacritic}/gu, '');

  let query = supabase.from('products').select('*, variants(*)');

  if (normalizedSearchTerm) {
    query = query.or(`name.ilike.%${normalizedSearchTerm}%,description.ilike.%${normalizedSearchTerm}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching products in SearchPage:', error);
    // You might want to show an error message to the user
    return <div>Error al buscar productos.</div>;
  }

  // Ensure the data is a plain object before passing it to the Client Component
  const plainProducts = JSON.parse(JSON.stringify(products || []));

  return <SearchResults products={plainProducts} searchTerm={searchTerm} />;
}
