import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { createClient } from '@/lib/supabase/server';
import ProductCarousels from '@/components/ProductCarousels';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from('products').select('*, variants(*)');

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <>
      <HeroSlider />

      <section id="productos" className="py-16">
        <div className="container mx-auto px-4" id="product-section-container">
          <h2 className="title-font text-3xl font-bold text-center my-12">Nuestros Productos</h2>
          <div id="specialties-container" className="hidden">
            <div id="nuestras-especialidades" className="mb-16">
              <h2 className="title-font text-3xl font-bold text-center mb-12">Nuestras Especialidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <a href="#" className="category-card bg-white rounded-lg overflow-hidden transition-slow hover:shadow-lg"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://cdn.todomueblesdebano.com/image/upload/c_lpad,f_auto,q_auto/v1/blog/ESTM/t0rk5z6taceuf3ohkvau')" }}></div><div className="p-4 text-center"><h3 className="font-medium text-lg">Mamparas</h3><p className="text-gray-600 text-sm">Diseño a medida</p></div></a>
                <a href="#" className="category-card bg-white rounded-lg overflow-hidden transition-slow hover:shadow-lg"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://img.kwcdn.com/product/fancy/50e1d4d3-553d-4ddd-804b-d73ea169edf5.jpg?imageView2/2/w/800/q/70/format/webp')" }}></div><div className="p-4 text-center"><h3 className="font-medium text-lg">Espejos</h3><p className="text-gray-600 text-sm">Personalizados y estándar</p></div></a>
                <a href="#" className="category-card bg-white rounded-lg overflow-hidden transition-slow hover:shadow-lg"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://www.baixmoduls.com/wp-content/uploads/2019/12/estanterias-decorativas-colgadas-a-pared.webp')" }}></div><div className="p-4 text-center"><h3 className="font-medium text-lg">Estructuras Metálicas</h3><p className="text-gray-600 text-sm">Diseños exclusivos</p></div></a>
                <a href="#" className="category-card bg-white rounded-lg overflow-hidden transition-slow hover:shadow-lg"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')" }}></div><div className="p-4 text-center"><h3 className="font-medium text-lg">Productos Estándar</h3><p className="text-gray-600 text-sm">Nueva línea disponible</p></div></a>
              </div>
            </div>
          </div>
          <ProductCarousels products={products || []} />
        </div>
      </section>

      <div id="hidden-content">
        <section id="nosotros" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8"><img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" alt="Nuestra tienda" className="rounded-lg shadow-lg w-full" /></div>
              <div className="md:w-1/2">
                <h2 className="title-font text-3xl font-bold mb-4">Fabricantes de Diseño</h2>
                <p className="text-gray-600 mb-4">Desde 2010, nos especializamos en la fabricación de productos decorativos y funcionales a medida. Mamparas, espejos y estructuras metálicas creadas artesanalmente según tus necesidades.</p>
                <p className="text-gray-600 mb-6">Ahora ampliamos nuestro catálogo con una línea de productos estándar, manteniendo nuestra esencia de calidad y diseño personalizado. Cada pieza es fabricada por nuestro equipo de expertos artesanos.</p>
                <div className="flex flex-wrap gap-4"><div className="flex items-center"><div className="bg-amber-100 text-amber-500 rounded-full p-3 mr-3"><i className="fas fa-medal text-xl"></i></div><div><h4 className="font-bold">Calidad Garantizada</h4><p className="text-gray-600 text-sm">Productos seleccionados</p></div></div><div className="flex items-center"><div className="bg-amber-100 text-amber-500 rounded-full p-3 mr-3"><i className="fas fa-truck text-xl"></i></div><div><h4 className="font-bold">Envío Rápido</h4><p className="text-gray-600 text-sm">Entrega en 2-5 días</p></div></div><div className="flex items-center"><div className="bg-amber-100 text-amber-500 rounded-full p-3 mr-3"><i className="fas fa-headset text-xl"></i></div><div><h4 className="font-bold">Soporte 24/7</h4><p className="text-gray-600 text-sm">Estamos para ayudarte</p></div></div></div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="title-font text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center mb-4 text-amber-500"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div><p className="text-gray-600 mb-4">"La mampara que encargué superó mis expectativas. Calidad y diseño impecables. El servicio al cliente fue excelente."</p><div className="flex items-center"><img src="https://randomuser.me/api/portraits/women/43.jpg" alt="María González" className="w-10 h-10 rounded-full mr-3" /><div><h4 className="font-medium">María González</h4><p className="text-gray-500 text-sm">Lima</p></div></div></div>
              <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center mb-4 text-amber-500"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i></div><p className="text-gray-600 mb-4">"El espejo decorativo es tal como en la foto. Llegó muy bien empaquetado y antes de lo esperado. Definitivamente volveré a comprar."</p><div className="flex items-center"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos Martínez" className="w-10 h-10 rounded-full mr-3" /><div><h4 className="font-medium">Carlos Martínez</h4><p className="text-gray-500 text-sm">Arequipa</p></div></div></div>
              <div className="bg-white p-6 rounded-lg shadow-sm"><div className="flex items-center mb-4 text-amber-500"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div><p className="text-gray-600 mb-4">"El servicio de diseño a medida fue increíble. Me ayudaron a crear la estantería perfecta para mi sala. ¡Encantada con el resultado!"</p><div className="flex items-center"><img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Laura Sánchez" className="w-10 h-10 rounded-full mr-3" /><div><h4 className="font-medium">Laura Sánchez</h4><p className="text-gray-500 text-sm">Trujillo</p></div></div></div>
            </div>
          </div>
        </section>
        <section id="inspiracion" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="title-font text-3xl font-bold text-center mb-8">Síguenos en Instagram</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Inspírate con nuestros diseños y comparte cómo decoras tus espacios con nuestros productos usando #DecoEstilos</p>
            <div className="instagram-feed">
              <div className="overflow-hidden rounded-lg"><img src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" alt="Instagram post" className="w-full h-full object-cover transition-slow hover:scale-105" /></div>
              <div className="overflow-hidden rounded-lg"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" alt="Instagram post" className="w-full h-full object-cover transition-slow hover:scale-105" /></div>
              <div className="overflow-hidden rounded-lg"><img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" alt="Instagram post" className="w-full h-full object-cover transition-slow hover:scale-105" /></div>
              <div className="overflow-hidden rounded-lg"><img src="https://esdefer.com/wp-content/uploads/2023/12/interrior-plano-vacio-elementos-decoracion.jpg" alt="Instagram post" className="w-full h-full object-cover transition-slow hover:scale-105" /></div>
            </div>
            <div className="text-center mt-8"><a href="#" className="inline-flex items-center text-amber-500 hover:text-amber-600 font-medium"><i className="fab fa-instagram mr-2 text-xl"></i> @DecoEstilos</a></div>
          </div>
        </section>
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="title-font text-3xl font-bold mb-4">¿Necesitas un diseño personalizado?</h2>
            <p className="max-w-2xl mx-auto mb-8">Nuestro equipo de diseñadores y artesanos puede crear la pieza perfecta para tu espacio.</p>
            <Link href="#contacto" className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition-slow inline-block">Solicita tu presupuesto</Link>
          </div>
        </section>
      </div>

      <section className="py-16 bg-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="title-font text-3xl font-bold mb-4">Suscríbete a nuestro newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">Recibe inspiración, promociones exclusivas y novedades directamente en tu correo.</p>
          <form className="max-w-md mx-auto flex flex-nowrap">
            <input type="email" placeholder="Tu correo electrónico" className="w-full px-4 py-3 rounded-l-full focus:outline-none text-gray-800 bg-white" />
            <button type="submit" className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-r-full font-medium transition-slow">Suscribirse</button>
          </form>
        </div>
      </section>


    </>
  );
}