import { addToCart } from './cart.js';
import { _supabase } from './main.js';

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const detailContainer = document.getElementById('product-detail-container');

    if (!productId) {
        if (detailContainer) {
            detailContainer.innerHTML = '<p class="text-center text-red-500">Producto no especificado.</p>';
        }
        return;
    }

    try {
        const { data: product, error } = await _supabase
            .from('products')
            .select('*, variants(*)')
            .eq('id', productId)
            .single();

        if (error) throw error;

        if (!product) {
            if (detailContainer) {
                detailContainer.innerHTML = '<p class="text-center text-red-500">Producto no encontrado.</p>';
            }
            return;
        }

        let variantsHtml = '';
        let sizeOptions = '';
        let colorOptions = '';
        const sizes = new Set();
        const colors = new Set();

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                if (variant.size) sizes.add(variant.size);
                if (variant.color) colors.add(variant.color);
            });

            if (sizes.size > 0) {
                sizeOptions = `<label for="size-select" class="block text-gray-700 text-sm font-bold mb-2">Medida:</label>
                               <select id="size-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                                   <option value="">Selecciona una medida</option>
                                   ${Array.from(sizes).map(size => `<option value="${size}">${size}</option>`).join('')}
                               </select>`;
            }

            if (colors.size > 0) {
                colorOptions = `<label for="color-select" class="block text-gray-700 text-sm font-bold mb-2">Color:</label>
                                <select id="color-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                                    <option value="">Selecciona un color</option>
                                    ${Array.from(colors).map(color => `<option value="${color}">${color}</option>`).join('')}
                                </select>`;
            }

            variantsHtml = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    ${sizeOptions}
                    ${colorOptions}
                </div>
                <div class="mb-6">
                    <label for="quantity-input" class="block text-gray-700 text-sm font-bold mb-2">Cantidad:</label>
                    <input type="number" id="quantity-input" value="1" min="1" class="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <p class="text-2xl font-bold text-amber-600 mb-6">Precio: S/ <span id="displayed-price">${product.variants[0].price.toFixed(2)}</span></p>
                <button id="add-to-cart-button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg w-full">Añadir al Carrito</button>
            `;
        } else {
            variantsHtml = '<p class="text-gray-600">Este producto no tiene variantes disponibles.</p>';
        }

        if (detailContainer) {
            detailContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src="${product.image_url || 'https://placehold.co/600x400/e2e8f0/4a5568?text=Imagen+no+disponible'}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-md mb-4">
                        ${product.tag ? `<div class="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">${product.tag}</div>` : ''}
                        <h1 class="text-4xl font-bold title-font mb-4">${product.name}</h1>
                        <p class="text-gray-700 mb-6">${product.description || 'No hay descripción disponible.'}</p>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold mb-4">Opciones</h2>
                        ${variantsHtml}
                    </div>
                </div>
            `;
        }

        // Lógica para actualizar el precio según la selección de variantes
        const sizeSelect = document.getElementById('size-select');
        const colorSelect = document.getElementById('color-select');
        const displayedPrice = document.getElementById('displayed-price');

        const updatePrice = () => {
            const selectedSize = sizeSelect ? sizeSelect.value : null;
            const selectedColor = colorSelect ? colorSelect.value : null;

            const matchingVariant = product.variants.find(v => {
                const sizeMatch = selectedSize ? v.size === selectedSize : true;
                const colorMatch = selectedColor ? v.color === selectedColor : true;
                return sizeMatch && colorMatch;
            });

            if (matchingVariant) {
                displayedPrice.textContent = matchingVariant.price.toFixed(2);
            } else {
                displayedPrice.textContent = 'N/A'; // O un mensaje de error
            }
        };

        if (sizeSelect) sizeSelect.addEventListener('change', updatePrice);
        if (colorSelect) colorSelect.addEventListener('change', updatePrice);

        // Add to Cart button event listener
        const addToCartButton = document.getElementById('add-to-cart-button');
        const quantityInput = document.getElementById('quantity-input');

        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                const selectedSize = sizeSelect ? sizeSelect.value : null;
                const selectedColor = colorSelect ? colorSelect.value : null;
                const quantity = parseInt(quantityInput.value, 10);

                if (isNaN(quantity) || quantity <= 0) {
                    alert('Por favor, introduce una cantidad válida.');
                    return;
                }

                const selectedVariant = product.variants.find(v => {
                    const sizeMatch = selectedSize ? v.size === selectedSize : true;
                    const colorMatch = selectedColor ? v.color === selectedColor : true;
                    return sizeMatch && colorMatch;
                });

                if (selectedVariant) {
                    addToCart(selectedVariant, quantity, product.name, product.image_url);
                } else {
                    alert('Por favor, selecciona una variante válida.');
                }
            });
        }

    } catch (error) {
        console.error('Error cargando detalles del producto:', error);
        if (detailContainer) {
            detailContainer.innerHTML = '<p class="text-center text-red-500">Error al cargar los detalles del producto.</p>';
        }
    }
}

// We need to make sure the product detail container exists before loading
if (document.getElementById('product-detail-container')) {
    document.addEventListener('DOMContentLoaded', loadProductDetail);
}