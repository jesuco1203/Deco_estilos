'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi'
import Image from 'next/image' // Import Image component

// Define the type for a product
interface Product {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
  minPrice: number;
}

// ProductCard component
const ProductCard = ({ product, onDelete }: { product: Product; onDelete: (id: number) => void }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-1">
    <Link href={`/products/edit/${product.id}`}>
        <div className="h-48 relative">
            <Image 
                src={product.image_url || 'https://placehold.co/600x400/e2e8f0/4a5568?text=No+Image'} 
                alt={product.name} 
                fill // Use fill to cover the parent div
                style={{ objectFit: 'cover' }} // Apply object-fit via style prop
            />
        </div>
    </Link>
    <div className="p-4">
      <p className="text-xs text-gray-500 uppercase font-semibold">{product.category}</p>
      <h3 className="text-lg font-bold text-gray-800 truncate mt-1">{product.name}</h3>
      <p className="text-amber-600 font-semibold mt-2">S/ {product.minPrice.toFixed(2)}</p>
    </div>
    <div className="flex justify-end space-x-2 p-4 border-t border-gray-100">
        <Link href={`/products/edit/${product.id}`} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <FiEdit size={18} />
        </Link>
        <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <FiTrash2 size={18} />
        </button>
    </div>
  </div>
);

// EmptyState component
const EmptyState = () => (
    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
        <FiPackage className="mx-auto text-5xl text-gray-400"/>
        <h2 className="mt-4 text-xl font-bold text-gray-700">No hay productos todavía</h2>
        <p className="mt-2 text-gray-500">¡Empieza por añadir tu primer producto!</p>
        <Link href="/products/new" className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors">
          <FiPlus className="mr-2" />
          Añadir Producto
        </Link>
    </div>
);

// ProductsList component
export default function ProductsList({ serverProducts }: { serverProducts: Product[] }) {
  const [products, setProducts] = useState(serverProducts)
  const supabase = createClient()

  const handleDelete = async (productId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) {
        console.error('Error deleting product:', error)
        alert('Error al eliminar el producto.')
      } else {
        setProducts(products.filter(p => p.id !== productId))
        alert('Producto eliminado con éxito.')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        {products.length > 0 && (
            <Link href="/products/new" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
              <FiPlus className="mr-2" />
              Añadir Producto
            </Link>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
