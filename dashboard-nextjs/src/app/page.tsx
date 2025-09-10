import { createClient } from '@/lib/supabase/server'
import ProductsList from './products-list'

export default async function ProductsPage() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, image_url, variants(price)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // Handle error appropriately
    return <div>Error loading products.</div>
  }

  const productsWithMinPrice = data.map(p => ({
    ...p,
    minPrice: p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : 0
  }));

  return <ProductsList serverProducts={productsWithMinPrice} />
}