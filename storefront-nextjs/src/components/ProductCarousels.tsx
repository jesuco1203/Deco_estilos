"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "./ProductCard";

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

export default function ProductCarousels({
  products,
}: {
  products: Product[];
}) {
  const groupedProducts = products.reduce(
    (acc, product) => {
      (acc[product.category] = acc[product.category] || []).push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div id="carousels-wrapper">
      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category} className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="title-font text-3xl font-bold">{category}</h2>
            <Link
              href={`/search?category=${encodeURIComponent(category)}`}
              className="text-amber-500 hover:text-amber-600 font-medium"
            >
              Ver todos →
            </Link>
          </div>
          <Swiper
            spaceBetween={16}
            slidesPerView={1.5} // Default for mobile (shows 1.5 cards)
            className="relative"
            breakpoints={{
              640: {
                // sm
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                // md
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1024: {
                // lg
                slidesPerView: 4,
                spaceBetween: 16,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
}
