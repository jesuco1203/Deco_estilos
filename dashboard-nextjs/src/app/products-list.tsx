"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEdit, FiPackage, FiPlus, FiTrash2 } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { getProductImageSrc } from "@/lib/images";

interface VariantRow {
  price: number | null;
}

interface ProductRow {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
  storage_key: string | null;
  variants: VariantRow[];
}

type Product = {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
  storage_key: string | null;
  minPrice: number;
};

function mapRows(rows: ProductRow[]): Product[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    image_url: row.image_url,
    storage_key: row.storage_key,
    minPrice: (() => {
      if (!row.variants?.length) return 0;
      const prices = row.variants
        .map((variant) =>
          typeof variant.price === "number" ? variant.price! : null,
        )
        .filter(
          (price): price is number => price !== null && !Number.isNaN(price),
        );
      if (prices.length === 0) return 0;
      return Math.min(...prices);
    })(),
  }));
}

const ProductCard = ({
  product,
  onDelete,
  index,
}: {
  product: Product;
  onDelete: (id: number) => void;
  index: number;
}) => {
  const src = useMemo(() => getProductImageSrc(product), [product]);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/products/edit/${product.id}`}>
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
            priority={index === 0}
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase text-gray-500">
          {product.category}
        </p>
        <h3 className="mt-1 truncate text-lg font-bold text-gray-800">
          {product.name}
        </h3>
        <p className="mt-2 text-amber-600 font-semibold">
          S/ {product.minPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-end gap-2 border-t border-gray-100 p-4">
        <Link
          href={`/products/edit/${product.id}`}
          className="rounded-full p-2 text-blue-500 transition-colors hover:bg-gray-200 hover:text-blue-700"
        >
          <FiEdit size={18} />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="rounded-full p-2 text-red-500 transition-colors hover:bg-gray-200 hover:text-red-700"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="rounded-lg border-2 border-dashed border-gray-200 py-14 text-center">
    <FiPackage className="mx-auto text-5xl text-gray-400" />
    <h2 className="mt-4 text-xl font-bold text-gray-700">
      No hay productos para esta categoría
    </h2>
    <p className="mt-2 text-gray-500">
      Prueba con otra categoría o añade un producto nuevo.
    </p>
    <Link
      href="/products/new"
      className="mt-6 inline-flex items-center rounded-full bg-blue-700 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-800"
    >
      <FiPlus className="mr-2" /> Añadir Producto
    </Link>
  </div>
);

export default function ProductsList({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const categoryKey = category ?? "all";

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("products")
          .select("id, name, category, image_url, storage_key, variants(price)")
          .order("created_at", { ascending: false });

        if (categoryKey !== "all") {
          query = query.eq("category", categoryKey);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        if (cancelled) return;

        setProducts(mapRows(data ?? []));
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!cancelled) setError("No se pudieron cargar los productos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [categoryKey, supabase]);

  const handleDelete = async (productId: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      alert("Error al eliminar el producto.");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Producto eliminado con éxito.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white px-4 py-6 text-sm text-gray-500 shadow">
        Cargando productos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white px-4 py-6 text-sm text-red-500 shadow">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-4 py-6 shadow">
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
