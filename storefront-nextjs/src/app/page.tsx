import { createClient } from '@/lib/supabase/server';
import MainContent from './MainContent';
import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from('products').select('*, variants(*)');

  if (error) {
    console.error('Error fetching products in HomePage:', error);
    // Handle the error appropriately
  }

  // Ensure the data is a plain object before passing it to the Client Component
  const plainProducts = JSON.parse(JSON.stringify(products || []));

  return (
    <>
      <HeroSlider />
      <h2 className="title-font text-3xl font-bold text-center my-12">Nuestros Productos</h2>
      <MainContent products={plainProducts} />

      {/* Re-adding other sections previously in MainContent */}
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

      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="title-font text-3xl font-bold mb-4">¿Necesitas un diseño personalizado?</h2>
          <p className="max-w-2xl mx-auto mb-8">Nuestro equipo de diseñadores y artesanos puede crear la pieza perfecta para tu espacio.</p>
          <Link href="#contacto" className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition-slow inline-block">Solicita tu presupuesto</Link>
        </div>
      </section>

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
