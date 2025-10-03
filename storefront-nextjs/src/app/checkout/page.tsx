'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactId = localStorage.getItem('decoEstilosContactId'); // Get contactId from localStorage

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: { ...formData, totalPrice },
          cartItems,
          contactId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pedido.');
      }

      const result = await response.json();
      clearCart(); // Clear the cart after successful order
      router.push(`/order-confirmation/${result.orderId}`); // Redirect to confirmation page

    } catch (error: any) {
      alert(error.message);
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600">No tienes productos en tu carrito para comprar.</p>
        <button onClick={() => router.push('/')} className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-slow">
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Resumen de tu orden</h2>
          <div className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center py-4">
                <img src={item.image || 'https://placehold.co/100x100'} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-grow ml-4">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color}{item.size && `, ${item.size}`}
                  </p>
                  <p className="text-sm">Cantidad: {item.quantity}</p>
                </div>
                <div className="font-semibold">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-amber-600">S/ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Información de contacto</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre completo</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección de envío</label>
              <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-slow">
              {loading ? 'Procesando...' : 'Realizar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
