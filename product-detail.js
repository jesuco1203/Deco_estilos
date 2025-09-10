import { addToCart } from './cart.js';
import { _supabase } from './main.js';

const colorMap = {
    'negro': 'black',
    'plateado': 'silver',
    'dorado': 'gold',
};

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
        const sizes = new Set();
        const colors = new Set();
        let availableColors = [];

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                if (variant.size) sizes.add(variant.size);
                if (variant.color) colors.add(variant.color);
            });
            availableColors = Array.from(colors).filter(Boolean);
            let sizeOptions = '';
            if (sizes.size > 1) {
                sizeOptions = `<label for="size-select" class="block text-gray-700 text-sm font-bold mb-2">Medida:</label>
                               <select id="size-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                                   <option value="">Selecciona una medida</option>
                                   ${Array.from(sizes).map(size => `<option value="${size}">${size}</option>`).join('')}
                               </select>`;
            } else if (sizes.size === 1) {
                const singleSize = Array.from(sizes)[0];
                sizeOptions = `<div class="mb-4">
                                    <p class="text-gray-700"><span class="font-bold">Medida:</span> ${singleSize || 'No especificada'}</p>
                               </div>`;
            }

            let colorOptions = '';
            if (availableColors.length > 1) {
                colorOptions = `<label class="block text-gray-700 text-sm font-bold mb-2">Color:</label>
                                <div id="color-selector" class="flex items-center space-x-2">
                                    ${availableColors.map(color => {
                                        const colorKey = color.toLowerCase();
                                        return `<div class="color-dot w-8 h-8 rounded-full border cursor-pointer" title="${color}" data-color="${color}" style="background-color: ${colorMap[colorKey] || color};"></div>`;
                                    }).join('')}
                                </div>`;
            } else if (availableColors.length === 1) {
                const singleColor = availableColors[0];
                const colorKey = singleColor.toLowerCase();
                colorOptions = `<div class="mb-6">
                                    <p class="font-bold text-gray-700 mb-2">Color:</p>
                                    <div class="flex items-center">
                                        <span class="w-6 h-6 rounded-full border" style="background-color: ${colorMap[colorKey] || singleColor};"></span>
                                        <span class="ml-2">${singleColor}</span>
                                    </div>
                                </div>`;
            }

            variantsHtml = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    ${sizeOptions}
                    ${colorOptions}
                </div>
            `;

            variantsHtml += `
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
        const colorSelector = document.getElementById('color-selector');
        const displayedPrice = document.getElementById('displayed-price');
        let selectedColor = availableColors.length > 0 ? availableColors[0] : null;

        const updatePrice = () => {
            const selectedSize = sizeSelect ? sizeSelect.value : (sizes.size === 1 ? Array.from(sizes)[0] : null);

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
        if (colorSelector) {
            colorSelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('color-dot')) {
                    selectedColor = e.target.dataset.color;
                    // Remove border from all dots
                    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('ring-2', 'ring-offset-2', 'ring-amber-500'));
                    // Add border to selected dot
                    e.target.classList.add('ring-2', 'ring-offset-2', 'ring-amber-500');
                    updatePrice();
                }
            });
        }

        // Add to Cart button event listener
        const addToCartButton = document.getElementById('add-to-cart-button');
        const quantityInput = document.getElementById('quantity-input');

        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                const selectedSize = sizeSelect ? sizeSelect.value : (sizes.size === 1 ? Array.from(sizes)[0] : null);
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