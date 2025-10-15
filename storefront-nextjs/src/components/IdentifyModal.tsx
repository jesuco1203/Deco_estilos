"use client";

import { useState } from "react";

interface IdentifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentify: (identity: string) => Promise<void>;
}

export default function IdentifyModal({
  isOpen,
  onClose,
  onIdentify,
}: IdentifyModalProps) {
  const [identity, setIdentity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      setError("Por favor, ingresa tu correo o teléfono.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await onIdentify(identity);
      // El onClose será llamado por el contexto si la identificación es exitosa
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error.";
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 lg:w-1/4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold">Guarda tu Wishlist</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Para guardar tus productos favoritos y verlos en cualquier
              dispositivo, por favor, déjanos tu correo o teléfono.
            </p>
            <input
              type="text"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="correo@ejemplo.com o 987654321"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
