"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

// Define the shape of a product
interface Product {
  id: number;
  name: string;
  image_url: string | null;
  storage_key: string | null;
  product_images: { storage_key: string | null; image_url?: string | null }[];
  tag: string | null;
  category: string;
  variants: {
    id: number;
    price: number;
    color: string | null;
    size: string | null;
    image_url: string | null;
    storage_key?: string | null;
  }[];
}

interface SearchResultsProps {
  products: Product[];
  searchTerm: string;
  category?: string;
  initialPage?: number;
}

const ITEMS_PER_PAGE = 20;

export default function SearchResults({
  products,
  searchTerm,
  category,
  initialPage = 1,
}: SearchResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(() => {
    const parsed = Number.isFinite(initialPage) ? Number(initialPage) : 1;
    return parsed > 0 ? parsed : 1;
  });

  useEffect(() => {
    // Scroll to the results section on initial render
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(initialPage > 0 ? initialPage : 1);
  }, [initialPage, searchTerm, category]);

  const trimmedSearchTerm = searchTerm.trim();
  const trimmedCategory = category?.trim() ?? "";

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, safePage]);

  const handlePageChange = (page: number) => {
    if (page === safePage || page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { scroll: false });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  let heading = "Todos los productos";
  if (trimmedSearchTerm && trimmedCategory) {
    heading = `Resultados para: "${trimmedSearchTerm}" en "${trimmedCategory}"`;
  } else if (trimmedSearchTerm) {
    heading = `Resultados de búsqueda para: "${trimmedSearchTerm}"`;
  } else if (trimmedCategory) {
    heading = `Productos en: "${trimmedCategory}"`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-12">{heading}</h1>
      <div ref={resultsRef}>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Paginación de resultados"
              >
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === safePage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-w-[42px] rounded-full px-4 py-2 text-sm font-medium transition-slow ${
                        isActive
                          ? "bg-[#f59e0b] text-gray-900"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </nav>
            )}
          </>
        ) : (
          <p className="text-center">
            No se encontraron productos para tu búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
