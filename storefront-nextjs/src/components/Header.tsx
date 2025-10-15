"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { showSection } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchTerm = searchParams.get("search") || "";

  const [desktopSearchInput, setDesktopSearchInput] =
    useState(currentSearchTerm);
  const [mobileSearchInput, setMobileSearchInput] = useState(currentSearchTerm);

  // Sync search input with URL search param
  useEffect(() => {
    setDesktopSearchInput(currentSearchTerm);
    setMobileSearchInput(currentSearchTerm);
  }, [currentSearchTerm]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (term) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    } else {
      router.push("/"); // Or maybe to '/search' to show all products?
    }
    setIsMobileSearchOpen(false); // Close mobile search after search
  };

  const handleDesktopSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleSearch(desktopSearchInput);
    }
  };

  const handleMobileSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleSearch(mobileSearchInput);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="h-full relative w-40">
              <Image
                src="/logo.png"
                alt="DecoEstilos Logo"
                fill
                style={{ objectFit: "contain" }}
                sizes="160px"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/#productos"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
            >
              Productos
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
            >
              {" "}
              {/* New Wishlist Link */}
              Favoritos
            </Link>
            <Link
              href="/#nosotros"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
              onClick={() => showSection("nosotros")}
            >
              Nosotros
            </Link>
            <Link
              href="/#inspiracion"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
              onClick={() => showSection("inspiracion")}
            >
              Inspiración
            </Link>
            <Link
              href="/#contacto"
              className="text-gray-800 hover:text-amber-500 transition-slow font-medium"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center relative">
            <input
              type="text"
              id="desktop-search-input"
              placeholder="Buscar..."
              className="bg-gray-100 rounded-full px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={desktopSearchInput}
              onChange={(e) => setDesktopSearchInput(e.target.value)}
              onKeyDown={handleDesktopSearchKeyDown}
            />
            <button
              onClick={() => handleSearch(desktopSearchInput)}
              id="desktop-search-button"
              className="absolute right-4 text-gray-500 hover:text-amber-500"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Icons (Mobile Search, Heart, Cart, Mobile Menu) */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleMobileSearch}
              className="md:hidden text-gray-800"
            >
              <i className="fas fa-search text-xl"></i>
            </button>
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="text-gray-800 hover:text-amber-500 transition-slow relative"
            >
              <i className="fas fa-heart text-xl"></i>
            </Link>
            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative text-gray-800 hover:text-amber-500 focus:outline-none"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-800"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div id="mobile-search-bar" className="md:hidden p-4 bg-white border-t">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-100 rounded-full px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={mobileSearchInput}
              onChange={(e) => setMobileSearchInput(e.target.value)}
              onKeyDown={handleMobileSearchKeyDown}
            />
            <button
              onClick={() => handleSearch(mobileSearchInput)}
              id="mobile-search-submit-button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 bg-white border-t" id="mobile-menu">
          <Link
            href="/"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={toggleMobileMenu}
          >
            Inicio
          </Link>
          <Link
            href="/#productos"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={toggleMobileMenu}
          >
            Productos
          </Link>
          <Link
            href="/wishlist"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={toggleMobileMenu}
          >
            {" "}
            {/* New Wishlist Link */}
            Favoritos
          </Link>
          <Link
            href="/#nosotros"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={() => {
              toggleMobileMenu();
              showSection("nosotros");
            }}
          >
            Nosotros
          </Link>
          <Link
            href="/#inspiracion"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={() => {
              toggleMobileMenu();
              showSection("inspiracion");
            }}
          >
            Inspiración
          </Link>
          <Link
            href="/#contacto"
            className="block py-2 px-4 text-gray-800 hover:text-amber-500"
            onClick={toggleMobileMenu}
          >
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
}
