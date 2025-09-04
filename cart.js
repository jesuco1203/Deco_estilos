// cart.js

// --- Elements ---
// These will be assigned in the initCart function
let cartModal;
let closeCartModalButton;
let cartItemsContainer;
let cartTotalElement;
let emptyCartMessage;
let checkoutButton;
let continueShoppingButton;
let cartView;
let checkoutView;
let backToCartButton;
let confirmOrderButton;
let cartIconLink;

// --- Core Cart Functions ---

export function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal(); // Always re-render after a change
}

export function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

export function addToCart(variant, quantity, product_name, product_image_url) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.variantId === variant.id);

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
    openCartModal();
}

// --- Modal Visibility ---

export function openCartModal() {
    if (cartModal) {
        cartModal.classList.remove('hidden');
        showCartView();
        renderCartModal();
    }
}

export function closeCartModal() {
    if (cartModal) {
        cartModal.classList.add('hidden');
    }
}

// --- Internal View Management ---

function showCartView() {
    if (cartView && checkoutView) {
        cartView.classList.remove('hidden');
        checkoutView.classList.add('hidden');
        const title = document.querySelector('#cart-modal .font-bold.title-font');
        if (title) title.textContent = 'Tu Carrito de Compras';
    }
}

function showCheckoutView() {
    if (cartView && checkoutView) {
        cartView.classList.add('hidden');
        checkoutView.classList.remove('hidden');
        const title = document.querySelector('#cart-modal .font-bold.title-font');
        if (title) title.textContent = 'Información de Envío';
    }
}

// --- Cart Content Rendering & Updates ---

function updateQuantity(variantId, change) {
    const cart = getCart();
    // Ensure we are comparing strings to strings, as dataset values are always strings.
    const itemIndex = cart.findIndex(item => String(item.variantId) === variantId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(variantId);
        } else {
            saveCart(cart);
        }
    }
}

function removeFromCart(variantId) {
    let cart = getCart();
    // Ensure we are comparing strings to strings.
    cart = cart.filter(item => String(item.variantId) !== variantId);
    saveCart(cart);
}

export function renderCartModal() {
    // This function can be called from outside, but it depends on elements being present.
    // Ensure initCart has been called.
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
    } else {
        if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
        if (checkoutButton) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        cart.forEach(item => {
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex items-center justify-between border-b border-gray-200 py-3';
            itemDiv.innerHTML = `
                <div class="flex items-center">
                    <a href="product-detail.html?id=${item.productId}">
                        <img src="${item.image_url || 'https://placehold.co/50x50/e2e8f0/4a5568?text=No+Image'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4">
                    </a>
                    <div>
                        <a href="product-detail.html?id=${item.productId}" class="font-medium text-gray-800 hover:text-amber-500 transition-slow">
                            <h4>${item.name}</h4>
                        </a>
                        <p class="text-sm text-gray-600">
                            ${item.size ? `Medida: ${item.size}` : ''}
                            ${item.size && item.color ? ' | ' : ''}
                            ${item.color ? `Color: ${item.color}` : ''}
                        </p>
                        <p class="text-sm text-amber-600">S/ ${item.price.toFixed(2)} c/u</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="quantity-decrease bg-gray-200 text-gray-700 px-2 py-1 rounded-md" data-variant-id="${item.variantId}">-</button>
                    <span class="quantity-display font-bold">${item.quantity}</span>
                    <button class="quantity-increase bg-gray-200 text-gray-700 px-2 py-1 rounded-md" data-variant-id="${item.variantId}">+</button>
                    <button class="remove-from-cart text-red-500 hover:text-red-700 ml-2" data-variant-id="${item.variantId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        if (cartTotalElement) cartTotalElement.textContent = total.toFixed(2);
    }
}


// --- Initialization ---

export function initCart() {
    // 1. Assign DOM elements
    cartModal = document.getElementById('cart-modal');
    closeCartModalButton = document.getElementById('close-cart-modal');
    cartItemsContainer = document.getElementById('cart-items-container');
    cartTotalElement = document.getElementById('cart-total');
    emptyCartMessage = document.getElementById('empty-cart-message');
    checkoutButton = document.getElementById('checkout-button');
    continueShoppingButton = document.getElementById('continue-shopping-button');
    cartView = document.getElementById('cart-view');
    checkoutView = document.getElementById('checkout-view');
    backToCartButton = document.getElementById('back-to-cart-button');
    confirmOrderButton = document.getElementById('confirm-order-button');
    cartIconLink = document.querySelector('a[href*="cart.html"], a#cart-icon-link');

    // 2. Add Event Listeners

    // Open/Close Modal
    if (cartIconLink) {
        cartIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }
    if (closeCartModalButton) {
        closeCartModalButton.addEventListener('click', closeCartModal);
    }
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', closeCartModal);
    }
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    // Cart Actions (Quantity, Remove) - Event Delegation
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const variantId = button.dataset.variantId;
            if (button.classList.contains('quantity-decrease')) {
                updateQuantity(variantId, -1);
            } else if (button.classList.contains('quantity-increase')) {
                updateQuantity(variantId, 1);
            } else if (button.classList.contains('remove-from-cart')) {
                removeFromCart(variantId);
            }
        });
    }

    // Checkout Process
    if (checkoutButton) {
        checkoutButton.addEventListener('click', showCheckoutView);
    }
    if (backToCartButton) {
        backToCartButton.addEventListener('click', showCartView);
    }
    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', handleConfirmOrder);
    }

    // 3. Initial Render
    updateCartCount();
    renderCartModal(); // Render the modal content on initialization
}

function handleConfirmOrder(e) {
    e.preventDefault();
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerPhone = document.getElementById('customer-phone').value;

    if (!customerName || !customerEmail || !customerAddress || !customerPhone) {
        alert('Por favor, completa todos los campos de envío.');
        return;
    }

    const orderDetails = {
        customer: {
            name: customerName,
            email: customerEmail,
            address: customerAddress,
            phone: customerPhone
        },
        items: getCart(),
        total: parseFloat(cartTotalElement.textContent)
    };

    console.log('Pedido Confirmado:', orderDetails);
    alert('¡Pedido confirmado! Revisa la consola para los detalles.');

    // Clear cart and close modal
    saveCart([]);
    closeCartModal();
}