'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

export default function HeroSlider() {
  return (
    <section id="inicio">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="hero-slider h-80"
      >
        <SwiperSlide
          className="bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.pinimg.com/1200x/79/3e/c5/793ec54b47bc10290b28a454d157bb56.jpg')" }}
        >
          <div className="slide-content h-full flex flex-col items-start justify-end text-left text-white p-8 md:p-16">
            <h1 className="title-font text-xl md:text-2xl font-light mb-4">Arte en Metal y Vidrio, a Tu Estilo</h1>
            <p className="text-sm font-light mb-8 max-w-sm text-justify">Creamos piezas únicas que transforman tus espacios. Desde mamparas de baño hasta espejos decorativos.</p>
          </div>
        </SwiperSlide>

        <SwiperSlide
          className="bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.imgur.com/Oc29S0n.png')" }}
        >
          <div className="slide-content h-full flex flex-col items-start justify-end text-left text-white p-8 md:p-16">
            <h1 className="title-font text-xl md:text-2xl font-light mb-4">Espejos que Definen tu Espacio</h1>
            <p className="text-sm font-light mb-8 max-w-sm text-justify">Descubre nuestra colección de espejos con marcos de metal, MDF o diseños sin marco que se adaptan a tu estilo.</p>
            <Link href="#productos" className="bg-white text-black hover:bg-gray-200 font-medium text-sm py-3 px-8 rounded-full transition-slow">Ver Colección de Espejos</Link>
          </div>
        </SwiperSlide>
        <SwiperSlide
          className="bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.imgur.com/7GQocKl.jpeg')" }}
        >
          <div className="slide-content h-full flex flex-col items-start justify-end text-left text-white p-8 md:p-16">
            <h1 className="title-font text-xl md:text-2xl font-light mb-4">Proyectos a Medida</h1>
            <p className="text-sm font-light mb-8 max-w-sm text-justify">Desde mamparas de ducha hasta estanterías industriales, convertimos tus ideas en realidad con diseños personalizados.</p>
            <Link href="#contacto" className="bg-white text-black hover:bg-gray-200 font-medium text-sm py-3 px-8 rounded-full transition-slow">Cotizar un Proyecto</Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}