"use client";

import { useEffect, useRef } from "react";
import MainContent from "../MainContent"; // Adjust path as needed

// Define the shape of a product
interface Product {
  id: number;
  name: string;
  image_url: string | null;
  storage_key: string | null;
  product_images: { storage_key: string }[];
  tag: string | null;
  category: string;
  variants: {
    id: number;
    price: number;
    color: string | null;
    size: string | null;
    image_url: string | null;
  }[];
}

interface SearchResultsProps {
  products: Product[];
  searchTerm: string;
}

export default function SearchResults({
  products,
  searchTerm,
}: SearchResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the results section on initial render
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-12">
        Resultados de búsqueda para: "{searchTerm}"
      </h1>
      <div ref={resultsRef}>
        {products.length > 0 ? (
          <MainContent products={products} />
        ) : (
          <p className="text-center">
            No se encontraron productos para tu búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
