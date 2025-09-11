import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  image_url: string | null;
  tag: string | null;
  variants: {
    price: number;
  }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = product.variants.length > 0 ? Math.min(...product.variants.map(v => v.price)) : 0;

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md transition-slow w-5/6 md:w-1/3 lg:w-1/4 flex-shrink-0 snap-center flex flex-col">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative">
          <img src={product.image_url || 'https://placehold.co/400x600/e2e8f0/4a5568?text=Imagen+no+disponible'} alt={product.name} className="w-full h-64 object-cover" />
          {product.tag && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{product.tag}</div>}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <span className="font-bold text-lg">S/ {minPrice > 0 ? minPrice.toFixed(2) : 'Consultar'}</span>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <button className="add-to-cart-btn bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-slow">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}