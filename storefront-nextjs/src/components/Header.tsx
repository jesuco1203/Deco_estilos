import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center h-full">
            <Link href="/" className="h-full">
              <img src="https://i.imgur.com/nKN165j.png" alt="DecoEstilos Logo" className="h-full w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 hover:text-amber-500 transition-slow font-medium">Inicio</Link>
            <Link href="/#productos" className="text-gray-800 hover:text-amber-500 transition-slow font-medium">Productos</Link>
            <Link href="/#inspiracion" className="text-gray-800 hover:text-amber-500 transition-slow font-medium">Inspiración</Link>
            <Link href="/#nosotros" className="text-gray-800 hover:text-amber-500 transition-slow font-medium">Nosotros</Link>
            <Link href="/#contacto" className="text-gray-800 hover:text-amber-500 transition-slow font-medium">Contacto</Link>
          </nav>
          <div className="hidden md:flex items-center relative">
            <input type="text" id="desktop-search-input" placeholder="Buscar..." className="bg-gray-100 rounded-full px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button id="desktop-search-button" className="absolute right-4 text-gray-500 hover:text-amber-500">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-800" id="mobile-search-button"><i className="fas fa-search text-xl"></i></button>
            <a href="#" className="text-gray-800 hover:text-amber-500 transition-slow relative">
              <i className="fas fa-heart text-xl"></i>
            </a>
            <a href="#" id="cart-icon-link" className="text-gray-800 hover:text-amber-500 transition-slow relative">
              <i className="fas fa-shopping-cart text-xl"></i>
              <span id="cart-count" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </a>
            <button className="md:hidden text-gray-800" id="mobile-menu-button"><i className="fas fa-bars text-xl"></i></button>
          </div>
        </div>
      </div>
      <div id="mobile-search-bar" className="hidden md:hidden p-4 bg-white border-t">
        <div className="relative">
          <input type="text" placeholder="Buscar..." className="bg-gray-100 rounded-full px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <button id="mobile-search-submit-button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <div className="md:hidden hidden py-4" id="mobile-menu">
        <Link href="/" className="block py-2 px-4 text-gray-800 hover:text-amber-500 mobile-menu-link">Inicio</Link>
        <Link href="/#productos" className="block py-2 px-4 text-gray-800 hover:text-amber-500 mobile-menu-link">Productos</Link>
        <Link href="/#inspiracion" className="block py-2 px-4 text-gray-800 hover:text-amber-500 mobile-menu-link">Inspiración</Link>
        <Link href="/#nosotros" className="block py-2 px-4 text-gray-800 hover:text-amber-500 mobile-menu-link">Nosotros</Link>
        <Link href="/#contacto" className="block py-2 px-4 text-gray-800 hover:text-amber-500 mobile-menu-link">Contacto</Link>
      </div>
    </header>
  );
}