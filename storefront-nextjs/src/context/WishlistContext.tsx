"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import IdentifyModal from "@/components/IdentifyModal"; // Importar el nuevo modal

// Comprobar si el usuario ya ha sido identificado
const isUserIdentified = () => !!localStorage.getItem("decoEstilosContactId");

const getAnonId = () => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )anon_id=([^;]+)/);
  return match ? match[1] : null;
};

const ensureAnonId = () => {
  if (typeof window === "undefined") return null;
  let anonId = getAnonId();
  if (!anonId) {
    anonId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    const maxAge = 60 * 60 * 24 * 365; // 1 año
    document.cookie = `anon_id=${anonId}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  return anonId;
};

interface WishlistContextType {
  wishlistItems: Set<number>;
  toggleWish: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToIdentify, setProductToIdentify] = useState<number | null>(
    null,
  );
  const [hasBeenIdentified, setHasBeenIdentified] = useState(false);
  const [anonId, setAnonId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    const identified = isUserIdentified();
    setHasBeenIdentified(identified);
    if (identified && typeof window !== "undefined") {
      setContactId(localStorage.getItem("decoEstilosContactId"));
    }
    const ensured = ensureAnonId();
    setAnonId(ensured);
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const currentAnonId = anonId ?? ensureAnonId();
      if (!anonId && currentAnonId) {
        setAnonId(currentAnonId);
      }
      const currentContactId =
        contactId ??
        (typeof window !== "undefined"
          ? localStorage.getItem("decoEstilosContactId")
          : null);
      if (!contactId && currentContactId) {
        setContactId(currentContactId);
      }
      try {
        const response = await fetch(
          currentAnonId
            ? `/api/wishlist/list?anonId=${encodeURIComponent(currentAnonId)}${currentContactId ? `&contactId=${encodeURIComponent(currentContactId)}` : ""}`
            : "/api/wishlist/list",
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.wishlist)
              ? data.wishlist
              : [];
          setWishlistItems(new Set(items));

          if (data.contactId) {
            setContactId(data.contactId);
            if (typeof window !== "undefined") {
              localStorage.setItem("decoEstilosContactId", data.contactId);
            }
            if (!hasBeenIdentified) {
              setHasBeenIdentified(true);
            }
          }
        } else {
          console.error(
            "Failed to fetch wishlist from backend:",
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, [hasBeenIdentified, anonId, contactId]);

  const toggleWish = async (productId: number) => {
    if (
      !hasBeenIdentified &&
      wishlistItems.size === 0 &&
      !isWishlisted(productId)
    ) {
      setProductToIdentify(productId);
      setIsModalOpen(true);
      return;
    }

    const isCurrentlyWishlisted = wishlistItems.has(productId);
    const newWishlistItems = new Set(wishlistItems);

    if (isCurrentlyWishlisted) {
      newWishlistItems.delete(productId);
    } else {
      newWishlistItems.add(productId);
    }

    setWishlistItems(newWishlistItems);

    try {
      const anonId = ensureAnonId();
      if (!anonId) {
        alert(
          "No se pudo generar un identificador para tus favoritos. Por favor, actualiza la página.",
        );
        return;
      }
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonId, productId }),
      });

      if (!response.ok) {
        setWishlistItems(wishlistItems);
        alert("Error al actualizar favoritos.");
      }
    } catch (error) {
      setWishlistItems(wishlistItems);
      alert("Error de conexión al actualizar favoritos.");
    }
  };

  const handleIdentify = async (identity: string) => {
    if (!productToIdentify) return;

    try {
      const anonId = ensureAnonId();
      if (!anonId) {
        alert(
          "No se pudo generar un identificador para tus favoritos. Por favor, actualiza la página.",
        );
        return;
      }

      const response = await fetch("/api/wishlist/identify", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Anon-ID": anonId,
          ...(contactId ? { "X-Contact-ID": contactId } : {}),
        },
        body: JSON.stringify({ identity, productId: productToIdentify }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo guardar la información.");
      }

      const mergedItems = Array.isArray(data?.items) ? data.items : [];
      if (data?.contactId && typeof window !== "undefined") {
        localStorage.setItem("decoEstilosContactId", data.contactId);
      }
      if (data?.contactId) {
        setContactId(data.contactId);
      }
      setHasBeenIdentified(true);
      setWishlistItems(new Set(mergedItems));
      setProductToIdentify(null);
    } catch (error) {
      console.error("Error during identification:", error);
      alert(
        "Hubo un error al procesar tu información. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const isWishlisted = (productId: number) => wishlistItems.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWish,
        isWishlisted,
        wishlistCount: wishlistItems.size,
      }}
    >
      {children}
      <IdentifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdentify={handleIdentify}
      />
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
