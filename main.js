import { initCart, addToCart } from './cart.js';

// --- Global State ---
let allProducts = [];

// --- Component Loading ---
const loadComponent = (elementId, url) => {
    // Return the fetch promise
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            } else {
                // It's okay if a placeholder doesn't exist on a given page
            }
        });
};

// --- Supabase Client ---
// This should be in its own module to avoid duplication
const supabaseUrl = 'https://qehmrxrrtestgxvqjjze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaG1yeHJydGVzdGd4dnFqanplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTI2OTIsImV4cCI6MjA3MTg4ODY5Mn0.hGXhKwBh-gNjx1sq195nnOdOm2yg2NcHvigF9RkCeAc';
export const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// --- UI Logic ---
function initUI() {
    // This function now runs after the header is loaded, so the elements should be present.
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const searchButton = document.getElementById('mobile-search-button'); // This is the button to show the mobile search bar
    const searchBar = document.getElementById('mobile-search-bar');
    const hiddenContent = document.getElementById('hidden-content');
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    const heroSpecialtiesButton = document.getElementById('hero-specialties-button');
    const specialtiesContainer = document.getElementById('specialties-container');

    if (menuButton && mobileMenu && searchBar) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            searchBar.classList.add('hidden');
        });
    }

    if (searchButton && searchBar && mobileMenu) {
        searchButton.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            mobileMenu.classList.add('hidden');
        });
    }
    
    allAnchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // If it's a link to another page, let the browser handle it
            if (targetId.startsWith('index.html#')) {
                return;
            }
            e.preventDefault();
            if (!document.querySelector(targetId)) return;
            if (hiddenContent && hiddenContent.classList.contains('hidden')) {
                hiddenContent.classList.remove('hidden');
            }
            if (mobileMenu && this.classList.contains('mobile-menu-link')) {
                mobileMenu.classList.add('hidden');
            }
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }, 100);
        });
    });

    if (heroSpecialtiesButton && specialtiesContainer) {
        heroSpecialtiesButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (specialtiesContainer.classList.contains('hidden')) {
                specialtiesContainer.classList.remove('hidden');
            }
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }, 100);
            }
        });
    }

    // --- Search Logic ---
    const desktopSearchInput = document.querySelector('.hidden.md\:flex input[type="text"]');
    const desktopSearchButton = document.getElementById('desktop-search-button');
    const mobileSearchInput = document.querySelector('#mobile-search-bar input[type="text"]');
    const mobileSearchSubmitButton = document.getElementById('mobile-search-submit-button');
    const isIndexPage = !!document.getElementById('carousels-wrapper');

    const performSearch = (searchTerm) => {
        if (isIndexPage) {
            handleSearch(searchTerm);
        } else {
            if (searchTerm.trim() !== '') {
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    };

    if (desktopSearchInput && desktopSearchButton) {
        desktopSearchButton.addEventListener('click', () => {
            performSearch(desktopSearchInput.value);
        });
        desktopSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch(desktopSearchInput.value);
            }
        });
    }

    if (mobileSearchInput && mobileSearchSubmitButton) {
        mobileSearchSubmitButton.addEventListener('click', () => {
            performSearch(mobileSearchInput.value);
        });
        mobileSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch(mobileSearchInput.value);
            }
        });
    }
}

// --- Search Handling ---
function handleSearch(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredProducts = allProducts.filter(product => {
        return product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
               product.category.toLowerCase().includes(lowerCaseSearchTerm);
    });
    renderProducts(filteredProducts);
}

// --- Slider and Carousel Logic ---
function initSliders() {
    if (document.querySelector('.hero-slider')) {
        new Swiper('.hero-slider', {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true }
        });
    }
}

const setupCarousel = (carouselId, prevBtnId, nextBtnId) => {
    const carouselContainer = document.getElementById(carouselId);
    if (!carouselContainer) return;
    const prevButton = document.getElementById(prevBtnId);
    const nextButton = document.getElementById(nextBtnId);
    const scrollAmount = () => {
        const firstCard = carouselContainer.querySelector('.product-card');
        if (!firstCard) return 0;
        const cardStyle = window.getComputedStyle(firstCard);
        const cardMargin = parseInt(cardStyle.marginRight, 10) || 0;
        return firstCard.offsetWidth + cardMargin;
    };
    if (nextButton) {
        nextButton.addEventListener('click', () => carouselContainer.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    }
    if (prevButton) {
        prevButton.addEventListener('click', () => carouselContainer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    }
};

// --- Product Rendering ---
function renderProducts(productsToRender) {
    const carouselsWrapper = document.getElementById('carousels-wrapper');
    if (!carouselsWrapper) return;

    if (productsToRender.length === 0) {
        carouselsWrapper.innerHTML = '<p class="text-center">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }

    const groupedProducts = productsToRender.reduce((acc, product) => {
        (acc[product.category] = acc[product.category] || []).push(product);
        return acc;
    }, {});

    let carouselsHTML = '';
    const carouselConfigs = [];

    for (const category in groupedProducts) {
        const categoryId = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const carouselId = `carousel-${categoryId}`;
        const prevBtnId = `prev-${categoryId}`;
        const nextBtnId = `next-${categoryId}`;
        carouselConfigs.push({ carousel: carouselId, prev: prevBtnId, next: nextBtnId });

        carouselsHTML += `
            <div class="mb-16">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="title-font text-3xl font-bold">${category}</h2>
                    <a href="#" class="text-amber-500 hover:text-amber-600 font-medium">Ver todos →</a>
                </div>
                <div class="relative px-12">
                    <div id="${carouselId}" class="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide gap-6">
        `;

        for (const product of groupedProducts[category]) {
            carouselsHTML += `
                <div class="product-card bg-white rounded-lg overflow-hidden shadow-md transition-slow w-5/6 md:w-1/3 lg:w-1/4 flex-shrink-0 snap-center flex flex-col">
                    <a href="product-detail.html?id=${product.id}" class="block">
                        <div class="relative">
                            <img src="${product.image_url || 'https://placehold.co/400x600/e2e8f0/4a5568?text=Imagen+no+disponible'}" alt="${product.name}" class="w-full h-64 object-cover">
                            ${product.tag ? `<div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">${product.tag}</div>` : ''}
                        </div>
                        <div class="p-4">
                            <h3 class="font-medium text-lg mb-1">${product.name}</h3>
                            <span class="font-bold text-lg">S/ ${product.minPrice !== null ? product.minPrice.toFixed(2) : 'Consultar'}</span>
                        </div>
                    </a>
                    <div class="p-4 pt-0 mt-auto">
                        <button class="add-to-cart-btn bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-slow" data-product-id="${product.id}">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
        }

        carouselsHTML += `
                    </div>
                    <button id="${prevBtnId}" class="absolute top-1/2 -translate-y-1/2 left-0 bg-white/70 backdrop-blur-sm rounded-full w-10 h-10 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-slow"><i class="fas fa-chevron-left"></i></button>
                    <button id="${nextBtnId}" class="absolute top-1/2 -translate-y-1/2 right-0 bg-white/70 backdrop-blur-sm rounded-full w-10 h-10 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-slow"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
    }

    carouselsWrapper.innerHTML = carouselsHTML;
    carouselConfigs.forEach(config => setupCarousel(config.carousel, config.prev, config.next));

    // Re-attach event listeners for the "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const product = allProducts.find(p => p.id == productId);
            if (product && product.variants && product.variants.length > 0) {
                const variant = product.variants[0];
                addToCart(variant, 1, product.name, product.image_url);
            } else {
                alert('Este producto no se puede añadir al carrito en este momento.');
            }
        });
    });
}

// --- Product Loading (for index page) ---
async function loadProducts() {
    const carouselsWrapper = document.getElementById('carousels-wrapper');
    if (!carouselsWrapper) {
        return;
    }

    try {
        const { data: products, error } = await _supabase.from('products').select('*, variants(*)').order('created_at', { ascending: false });
        if (error) throw error;

        allProducts = products.map(product => {
            if (product.variants && product.variants.length > 0) {
                const minPrice = Math.min(...product.variants.map(v => v.price));
                return { ...product, minPrice };
            }
            return { ...product, minPrice: null };
        });

        renderProducts(allProducts);

        // Check for search query in URL after loading products
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        if (searchTerm) {
            // Populate search boxes and filter
            const desktopSearchInput = document.querySelector('.hidden.md\:flex input[type="text"]');
            const mobileSearchInput = document.querySelector('#mobile-search-bar input[type="text"]');
            if(desktopSearchInput) desktopSearchInput.value = searchTerm;
            if(mobileSearchInput) mobileSearchInput.value = searchTerm;
            handleSearch(searchTerm);
        }

    } catch (error) {
        console.error('Error cargando productos:', error);
        if (carouselsWrapper) {
            carouselsWrapper.innerHTML = '<p class="text-center text-red-500">Error al cargar los productos.</p>';
        }
    }
}


// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const headerPromise = loadComponent("header-placeholder", "header.html");
    const footerPromise = loadComponent("footer-placeholder", "footer.html");
    const cartModalPromise = loadComponent("cart-modal-placeholder", "cart-modal.html");

    // Wait for the header and cart modal to load before initializing UI and Cart
    Promise.all([headerPromise, cartModalPromise]).then(() => {
        initUI();
        initCart();
    }).catch(error => {
        console.error("Error initializing UI or Cart after components load:", error);
    });

    // Page-specific initializations
    if (document.getElementById('carousels-wrapper')) {
        initSliders();
        loadProducts();
    }
});
