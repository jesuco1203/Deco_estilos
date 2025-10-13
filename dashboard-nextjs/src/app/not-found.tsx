// NO 'use client' aquí
export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Verifica la URL o vuelve al inicio.
      </p>
    </main>
  );
}
