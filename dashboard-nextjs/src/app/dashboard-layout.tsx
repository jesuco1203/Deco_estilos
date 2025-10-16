"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  FiGrid,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiPlusSquare,
} from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger, useSheet } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import CategoryScroller from "@/components/CategoryScroller";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

type SidebarProps = {
  pathname: string;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onNavigate?: () => void;
  onLogout: () => Promise<void> | void;
};

const navLinkBase =
  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors";

function Sidebar({
  pathname,
  selectedCategory,
  onSelectCategory,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const isProducts = pathname === "/";
  const isCreate = pathname === "/products/new";

  return (
    <div className="flex h-full flex-col gap-6 bg-gray-900 px-5 py-6 text-white">
      <div className="text-2xl font-bold">DecoEstilos</div>
      <nav className="space-y-2">
        <Link
          href="/"
          onClick={() => onNavigate?.()}
          className={`${navLinkBase} ${
            isProducts
              ? "bg-amber-500 text-white"
              : "text-gray-200 hover:bg-gray-800"
          }`}
        >
          <FiGrid />
          Productos
        </Link>
        <Link
          href="/products/new"
          onClick={() => onNavigate?.()}
          className={`${navLinkBase} ${
            isCreate
              ? "bg-amber-500 text-white"
              : "text-gray-200 hover:bg-gray-800"
          }`}
        >
          <FiPlusSquare />
          Añadir producto
        </Link>
      </nav>

      <div className="mt-auto space-y-6">
        <div className="md:hidden">
          <p className="mb-2 text-sm font-semibold text-white/70">
            Categorías
          </p>
          <CategoryScroller
            categories={PRODUCT_CATEGORIES}
            selected={selectedCategory}
            onSelect={(slug) => {
              onSelectCategory(slug);
              onNavigate?.();
            }}
          />
        </div>

        <button
          type="button"
          onClick={async () => {
            await onLogout();
            onNavigate?.();
          }}
          className={`${navLinkBase} justify-center border border-white/10 text-white hover:bg-gray-800`}
        >
          <FiLogOut />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function SheetSidebar(props: SidebarProps) {
  const { setOpen } = useSheet();
  const handleNavigate = useCallback(() => setOpen(false), [setOpen]);
  return <Sidebar {...props} onNavigate={handleNavigate} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const selectedCategory = searchParams?.get("category") ?? "all";

  const handleSelectCategory = useCallback(
    (slug: string) => {
      const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
      if (slug === "all") {
        nextParams.delete("category");
      } else {
        nextParams.set("category", slug);
      }
      const query = nextParams.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 border-b bg-white px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger
            aria-label="Abrir menú"
            className="rounded-lg border border-gray-200 p-2"
          >
            <FiMenu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900 text-white">
            <SheetSidebar
              pathname={pathname}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>

        <span className="text-base font-semibold text-gray-900">
          Panel DecoEstilos
        </span>

        <Link
          href="/products/new"
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
        >
          <FiPlus className="h-4 w-4" /> Nuevo
        </Link>
      </header>

      <div className="grid gap-0 md:grid-cols-[250px_1fr]">
        <aside className="hidden h-full min-h-screen border-r border-gray-200 md:block">
          <Sidebar
            pathname={pathname}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onLogout={handleLogout}
          />
        </aside>
        <main className="px-4 py-6 md:px-10 md:py-8">
          <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
