'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Define types for Product and Variant
interface Variant {
  id?: number;
  size: string;
  color: string;
  price: string;
  stock_quantity: number;
  image_url: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  tag: string;
  variants: Variant[];
}

const categories = [
  'Espejos con marco de metal',
  'Espejos sin marco',
  'Espejos con marco MDF',
  'Espejos corporativos',
  'Mamparas',
  'Estructuras decorativas',
];

const colors = ['Negro', 'Plateado', 'Dorado'];

const defaultVariant: Variant = {
    size: '',
    color: colors[0],
    price: '',
    stock_quantity: 0,
    image_url: '',
};

export default function ProductForm({ product: initialProduct }: { product?: Product }) {
  const [product, setProduct] = useState(initialProduct || {
    name: '',
    description: '',
    category: categories[0],
    image_url: '',
    tag: 'Ninguna',
    variants: [],
  });

  const [variants, setVariants] = useState<Variant[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [{ ...defaultVariant }]
  );
  
  const [hasVariants, setHasVariants] = useState(
    initialProduct ? initialProduct.variants.length > 1 : false
  );

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [name]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { ...defaultVariant }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleHasVariantsChange = (checked: boolean) => {
    if (!checked) { // Toggling from multi-variant to simple
      if (variants.length > 1 && window.confirm('Esto eliminará todas las variantes excepto la primera. ¿Continuar?')) {
        setVariants(variants.slice(0, 1));
        setHasVariants(false);
      } else if (variants.length <= 1) {
        setHasVariants(false);
      }
    } else { // Toggling from simple to multi-variant
      setHasVariants(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Validation ---
    for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant.price || parseFloat(variant.price) <= 0) {
            alert(`Por favor, introduce un precio válido para la Variante #${i + 1}.`);
            return;
        }
        if (!variant.size || variant.size.trim() === '') {
            alert(`Por favor, introduce una medida para la Variante #${i + 1}.`);
            return;
        }
    }

    setLoading(true);

    const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        image_url: product.image_url,
        tag: product.tag === 'Ninguna' ? null : product.tag,
    };

    let currentProductId = initialProduct?.id;
    let productError;

    // Step 1: Upsert the main product data
    if (currentProductId) {
      const { error } = await supabase.from('products').update(productData).match({ id: currentProductId });
      productError = error;
    } else {
      const { data, error } = await supabase.from('products').insert([productData]).select('id').single();
      if (data) {
        currentProductId = data.id;
      }
      productError = error;
    }

    if (productError) {
      alert('Error al guardar el producto: ' + productError.message);
      setLoading(false);
      return;
    }

    if (!currentProductId) {
        alert('No se pudo obtener el ID del producto para guardar las variantes.');
        setLoading(false);
        return;
    }

    // Step 2: Determine which variants to delete
    if (initialProduct) {
        const initialVariantIds = initialProduct.variants.map(v => v.id);
        const finalVariantIds = variants.map(v => v.id).filter(id => id);
        const variantIdsToDelete = initialVariantIds.filter(id => !finalVariantIds.includes(id));

        if (variantIdsToDelete.length > 0) {
            const { error: deleteError } = await supabase.from('variants').delete().in('id', variantIdsToDelete);
            if (deleteError) {
                alert('Error al eliminar variantes antiguas: ' + deleteError.message);
                setLoading(false);
                return;
            }
        }
    }

    // Step 3: Upsert the current variants
    if (variants.length > 0) {
        const variantsToUpsert = variants.map(v => ({
            id: v.id === undefined || v.id === 0 ? null : v.id, // Explicitly set undefined or 0 IDs to null for new variants
            product_id: currentProductId,
            size: v.size,
            color: v.color,
            price: parseFloat(v.price), // Ensure price is a number
            stock_quantity: v.stock_quantity,
            image_url: v.image_url || null,
        }));

        const { error: upsertError } = await supabase.from('variants').upsert(variantsToUpsert);

        if (upsertError) {
            alert('Error al guardar las variantes: ' + upsertError.message);
            setLoading(false);
            return;
        }
    }

    alert(`¡Producto ${initialProduct ? 'actualizado' : 'creado'} exitosamente!`);
    router.push('/');
    setLoading(false);
  };

  const renderVariantForm = (variant: Variant, index: number, isMultiVariant: boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor={`size-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Medida</label>
        <input type="text" name="size" id={`size-${index}`} value={variant.size} onChange={(e) => handleVariantChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Ej: 0.60 x 0.90 m" />
      </div>
      <div>
        <label htmlFor={`color-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Color</label>
        <select name="color" id={`color-${index}`} value={variant.color} onChange={(e) => handleVariantChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`price-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Precio (S/)</label>
        <input type="number" name="price" id={`price-${index}`} value={variant.price} onChange={(e) => handleVariantChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" step="0.01" required />
      </div>
      <div className="col-span-1 md:col-span-3">
        <label htmlFor={`stock-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Cantidad en Stock</label>
        <input type="number" name="stock_quantity" id={`stock-${index}`} value={variant.stock_quantity} onChange={(e) => handleVariantChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      {isMultiVariant && (
        <div className="col-span-1 md:col-span-3">
          <label htmlFor={`variant-image-${index}`} className="block text-gray-700 text-sm font-bold mb-2">URL de Imagen de Variante (Opcional)</label>
          <input type="url" name="image_url" id={`variant-image-${index}`} value={variant.image_url} onChange={(e) => handleVariantChange(index, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="https://ejemplo.com/variante.jpg" />
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{product.id ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Product Details */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
            <input type="text" name="name" id="name" value={product.name} onChange={handleProductChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
            <textarea name="description" id="description" value={product.description} onChange={handleProductChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="4"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
              <select name="category" id="category" value={product.category} onChange={handleProductChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tag" className="block text-gray-700 text-sm font-bold mb-2">Etiqueta</label>
              <select name="tag" id="tag" value={product.tag || 'Ninguna'} onChange={handleProductChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                {['Ninguna', '15% de dcto', 'producto nuevo', 'a medida'].map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="image_url" className="block text-gray-700 text-sm font-bold mb-2">URL de la Imagen Principal</label>
            <input type="url" name="image_url" id="image_url" value={product.image_url} onChange={handleProductChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
          
          {/* Variants Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Detalles del Producto y Variantes</h2>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="has-variants" checked={hasVariants} onChange={e => handleHasVariantsChange(e.target.checked)} className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
              <label htmlFor="has-variants" className="ml-2 block text-sm text-gray-900">Este producto tiene múltiples variantes (por color, medida, etc.)</label>
            </div>

            {!hasVariants && variants[0] && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Producto Simple</h3>
                {renderVariantForm(variants[0], 0, hasVariants)}
              </div>
            )}

            {hasVariants && (
              <div>
                {variants.map((variant, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 relative">
                    <h3 className="font-semibold mb-2">Variante #{index + 1}</h3>
                    {renderVariantForm(variant, index, hasVariants)}
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs">
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVariant} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6">
                  + Añadir Otra Variante
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-8">
            <button type="button" onClick={() => router.push('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded">
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}