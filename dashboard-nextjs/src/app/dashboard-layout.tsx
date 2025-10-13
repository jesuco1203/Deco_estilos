"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiGrid, FiLogOut, FiPlusSquare, FiX } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedCategory = searchParams?.get("category") ?? "all";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClasses =
    "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200";
  const activeLinkClasses = "bg-amber-500 text-white";

  const Navigation = () => (
    <>
      <nav className="flex-grow space-y-2">
        <Link
          href="/"
          className={`${linkClasses} ${pathname === "/" ? activeLinkClasses : ""}`}
        >
          <FiGrid className="mr-3" />
          <span>Productos</span>
        </Link>
        <Link
          href="/products/new"
          className={`${linkClasses} ${pathname === "/products/new" ? activeLinkClasses : ""}`}
        >
          <FiPlusSquare className="mr-3" />
          <span>Añadir Producto</span>
        </Link>
      </nav>
      <div className="mt-6 md:mt-auto">
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
          <FiLogOut className="mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
      <div className="mt-8 space-y-3 md:hidden">
        <p className="text-sm font-semibold text-white/80">Categorías</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              router.replace("/", { scroll: false });
            }}
            className={`rounded-full px-3 py-1 text-sm transition ${
              selectedCategory === "all"
                ? "bg-amber-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Todas
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.slug}
              onClick={() => {
                setMobileMenuOpen(false);
                router.replace(`/?category=${encodeURIComponent(cat.slug)}`, {
                  scroll: false,
                });
              }}
              className={`rounded-full px-3 py-1 text-sm transition ${
                selectedCategory === cat.slug
                  ? "bg-amber-500 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg border px-3 py-2"
        >
          ☰
        </button>
        <span className="text-lg font-semibold">DecoEstilos</span>
        <span className="w-8" aria-hidden="true" />
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-gray-800 p-4 text-white md:flex">
        <div className="mb-10 text-2xl font-bold text-white">DecoEstilos</div>
        <Navigation />
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-10 w-72 max-w-[85%] bg-gray-800 p-4 text-white shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold">Menú</span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-white/20 px-2 py-1"
              >
                <FiX />
              </button>
            </div>
            <Navigation />
          </div>
        </div>
      )}

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
