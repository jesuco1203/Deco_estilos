"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        ¡Pedido Realizado con Éxito!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Gracias por tu compra. Tu pedido ha sido procesado correctamente.
      </p>
      <p className="text-xl font-semibold mb-8">
        Número de Pedido: <span className="text-amber-600">{orderId}</span>
      </p>
      <p className="text-gray-500">
        Serás redirigido a la página principal en {countdown} segundos...
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-slow"
      >
        Volver a la página principal
      </button>
    </div>
  );
}
