import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/app/products/product-form'
import { notFound } from 'next/navigation'

export default async function EditProductPage(props: { params: { id: string } }) {
  const id = props.params.id;
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, variants(*)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return <ProductForm product={product} />
}
