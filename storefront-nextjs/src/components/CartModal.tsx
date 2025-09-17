'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartModal() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50"> {/* Removed onClick={closeCart} and changed background */}
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold">Tu Carrito ({itemCount})</h3>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Modal Body */}
        {cartItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="p-4 flex-grow overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 mb-4">
                <img src={item.image || 'https://placehold.co/100x100'} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.color}{item.size && `, ${item.size}`}
                  </p>
                  <p className="text-sm font-bold">S/ {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-md">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded-md">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold text-amber-600">S/ {totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-slow">
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}