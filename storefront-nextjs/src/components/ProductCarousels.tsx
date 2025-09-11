'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  image_url: string | null;
  tag: string | null;
  category: string;
  variants: {
    price: number;
  }[];
}

export default function ProductCarousels({ products }: { products: Product[] }) {
  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.category] = acc[product.category] || []).push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div id="carousels-wrapper">
      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category} className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="title-font text-3xl font-bold">{category}</h2>
            <a href="#" className="text-amber-500 hover:text-amber-600 font-medium">Ver todos →</a>
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={4}
            navigation
            className="relative px-12"
          >
            {products.map(product => (
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