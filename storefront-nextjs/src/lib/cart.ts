import { createClient } from "@/lib/supabase/client";

// --- Definiciones de Tipos ---
interface Variant {
  id: number;
  product_id: number;
  size: string;
  color: string;
  price: number;
  image_url: string | null;
}

interface CartItem {
  productId: number;
  variantId: number;
  name: string;
  size: string;
  color: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

// --- Cliente Supabase (parece no usarse, pero se deja por ahora) ---
const supabase = createClient();

// --- Funciones del Carrito ---

export function getCart(): CartItem[] {
  const cart = localStorage.getItem("shoppingCart");
  return cart ? (JSON.parse(cart) as CartItem[]) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

export function addToCart(
  variant: Variant,
  quantity: number,
  product_name: string,
  product_image_url: string | null,
) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (item: CartItem) => item.variantId === variant.id,
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      productId: variant.product_id,
      variantId: variant.id,
      name: product_name,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      image_url: variant.image_url || product_image_url,
      quantity: quantity,
    });
  }
  saveCart(cart);
  alert("Producto añadido al carrito!");
}
