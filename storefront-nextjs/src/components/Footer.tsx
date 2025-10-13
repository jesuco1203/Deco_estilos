import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="title-font text-xl font-bold mb-4">DecoEstilos</h3>
            <p className="text-gray-400 mb-4">
              Tu destino para encontrar los mejores productos de decoración y
              diseño para tu hogar.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-slow"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-slow"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-slow"
              >
                <i className="fab fa-pinterest-p"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-slow"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Todos los productos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Nuevos lanzamientos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Ofertas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Información</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-slow"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Métodos de Pago</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative h-8 w-12">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="50px"
                />
              </div>
              <div className="relative h-8 w-12">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                  alt="Mastercard"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="50px"
                />
              </div>
              <div className="relative h-8 w-12">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/0/08/Icono_de_la_aplicaci%C3%B3n_Yape.png"
                  alt="Yape"
                  fill
                  sizes="(max-width: 768px) 48px, 48px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>Av. Industrial 123, Ate, Lima, Perú</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3"></i>
                <span>+51 947 432 228</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>hola@decoestilos.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3"></i>
                <span>L-V: 9:00 - 19:00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 DecoEstilos. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-slow"
            >
              Términos y condiciones
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-slow"
            >
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
