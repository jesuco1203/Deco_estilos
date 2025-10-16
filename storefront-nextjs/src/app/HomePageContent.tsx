"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import MainContent from "./MainContent";
import { useUI } from "@/context/UIContext";

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

interface HomePageContentProps {
  products: Product[];
}

export default function HomePageContent({ products }: HomePageContentProps) {
  const { activeSection } = useUI();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.error || "Error al suscribirse.");
      } else {
        setMessage("¡Gracias por suscribirte!");
        setEmail(""); // Clear the input
      }
    } catch (error) {
      setIsError(true);
      setMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroSlider />
      <h2 className="title-font text-3xl font-bold text-center my-12">
        Nuestros Productos
      </h2>
      <MainContent products={products} />

      {/* Sections previously in MainContent */}
      <div id="hidden-content">
      {activeSection === "nosotros" && (
        <section id="nosotros" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-8">
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="title-font text-3xl font-bold">
                  Fabricantes de Diseño
                </h2>
                <p className="text-gray-600">
                  Desde 2010, nos especializamos en la fabricación de productos
                  decorativos y funcionales a medida. Mamparas, espejos y
                  estructuras metálicas creadas artesanalmente según tus
                  necesidades.
                </p>
                <p className="text-gray-600">
                  Ahora ampliamos nuestro catálogo con una línea de productos
                  estándar, manteniendo nuestra esencia de calidad y diseño
                  personalizado. Cada pieza es fabricada por nuestro equipo de
                  expertos artesanos.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-500 rounded-full p-3">
                      <i className="fas fa-medal text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Calidad Garantizada</h4>
                      <p className="text-gray-600 text-sm">
                        Productos seleccionados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-500 rounded-full p-3">
                      <i className="fas fa-truck text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Envío Rápido</h4>
                      <p className="text-gray-600 text-sm">
                        Entrega en 2-5 días
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-500 rounded-full p-3">
                      <i className="fas fa-headset text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">Soporte 24/7</h4>
                      <p className="text-gray-600 text-sm">
                        Estamos para ayudarte
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 md:pl-8 aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/nosotros/nosotros.webp"
                  alt="Nuestra tienda"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="title-font text-3xl font-bold text-center mb-12">
              Lo que dicen nuestros clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4 text-amber-500">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;La mampara que encargué superó mis expectativas. Calidad y
                  diseño impecables. El servicio al cliente fue excelente.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/testimonials/maria.webp"
                    alt="María González"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">María González</h4>
                    <p className="text-gray-500 text-sm">Lima</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4 text-amber-500">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;El espejo decorativo es tal como en la foto. Llegó muy bien
                  empaquetado y antes de lo esperado. Definitivamente volveré a
                  comprar.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/testimonials/carlos.webp"
                    alt="Carlos Martínez"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">Carlos Martínez</h4>
                    <p className="text-gray-500 text-sm">Arequipa</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4 text-amber-500">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;El servicio de diseño a medida fue increíble. Me ayudaron a
                  crear la estantería perfecta para mi sala. ¡Encantada con el
                  resultado!.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/testimonials/laura.webp"
                    alt="Laura Sánchez"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">Laura Sánchez</h4>
                    <p className="text-gray-500 text-sm">Trujillo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {activeSection === "inspiracion" && (
          <section id="inspiracion" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="title-font text-3xl font-bold text-center mb-8">
                Síguenos en Instagram
              </h2>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                Inspírate con nuestros diseños y comparte cómo decoras tus
                espacios con nuestros productos usando #DecoEstilos
              </p>
              <div className="instagram-feed">
                <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                  <Image
                    src="/images/inspiracion/1.webp"
                    alt="Instagram post 1"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-slow hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                  <Image
                    src="/images/inspiracion/2.webp"
                    alt="Instagram post 2"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-slow hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                  <Image
                    src="/images/inspiracion/3.webp"
                    alt="Instagram post 3"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-slow hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                  <Image
                    src="/images/inspiracion/4.webp"
                    alt="Instagram post 4"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-slow hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 25vw"
                  />
                </div>{" "}
              </div>
              <div className="text-center mt-8">
                <a
                  href="#"
                  className="inline-flex items-center text-amber-500 hover:text-amber-600 font-medium"
                >
                  <i className="fab fa-instagram mr-2 text-xl"></i> @DecoEstilos
                </a>
              </div>
            </div>
          </section>
        )}
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="title-font text-3xl font-bold mb-4">
              ¿Necesitas un diseño personalizado?
            </h2>
            <p className="max-w-2xl mx-auto mb-8">
              Nuestro equipo de diseñadores y artesanos puede crear la pieza
              perfecta para tu espacio.
            </p>
            <Link
              href="#contacto"
              className="bg-[#d9c034] hover:bg-[#c0ad2d] text-gray-900 font-medium py-3 px-8 rounded-full transition-slow inline-block"
            >
              Solicita tu presupuesto
            </Link>
          </div>
        </section>
      </div>

      <section className="py-16 bg-[#d9c034] text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="title-font text-3xl font-bold mb-4">
            Suscríbete a nuestro newsletter
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Recibe inspiración, promociones exclusivas y novedades directamente
            en tu correo.
          </p>
          <form className="max-w-md mx-auto flex flex-nowrap">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full px-4 py-3 rounded-l-full focus:outline-none text-gray-800 bg-white"
            />
            <button
              type="submit"
              className="bg-[#d9c034] hover:bg-[#c0ad2d] text-gray-900 px-6 py-3 rounded-r-full font-medium transition-slow"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Deco Estilos",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Huancayo",
              addressRegion: "Junín",
              addressCountry: "PE",
            },
            url: "https://deco-estilos.vercel.app",
            telephone: "+51 947 432 228",
          }),
        }}
      />
    </>
  );
}
