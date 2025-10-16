"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryScroller from "@/components/CategoryScroller";
import ProductsList from "./products-list";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

export default function ProductsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categories = useMemo(() => PRODUCT_CATEGORIES, []);
  const categoryFromParams = searchParams?.get("category") ?? "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromParams,
  );

  useEffect(() => {
    setSelectedCategory(categoryFromParams);
  }, [categoryFromParams]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    setSelectedCategory(slug);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white px-4 py-6 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Gestión de Productos
          </h1>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <CategoryScroller
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategoryChange}
            className="py-1"
          />
          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 active:scale-[0.99]"
          >
            + Añadir
          </Link>
        </div>
      </div>

      <ProductsList category={selectedCategory} />
    </div>
  );
}
