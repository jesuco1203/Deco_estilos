import { createClient } from '@/lib/supabase/client';

// --- Supabase Client ---
const supabase = createClient();

// --- Core Cart Functions ---

export function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: any[]) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    // In a real app, you'd also update UI elements here
}

export function addToCart(variant: any, quantity: number, product_name: string, product_image_url: string | null) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex((item: any) => item.variantId === variant.id);

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
            quantity: quantity
        });
    }
    saveCart(cart);
    alert('Producto añadido al carrito!');
    // In a real app, you'd open a cart modal here
}

// You can add updateQuantity, removeFromCart, etc. here as well
