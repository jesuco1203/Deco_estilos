"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <main className="flex min-h-[60vh] flex-col items-start justify-center gap-4 px-6 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">
        Página no encontrada
      </h1>
      <p className="max-w-lg text-sm text-gray-500">
        {query
          ? `No encontramos resultados para “${query}”.`
          : "Verifica la URL o vuelve al inicio."}
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
