// src/main.ts

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StorePage } from './pages/StorePage';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import './styles/main.css';

interface PageComponent {
    render(): string;
    initPage?(): Promise<void>; 
    attachEventListeners?(): void;
}

class App {
    private currentPage: string = 'home';
    private appElement: HTMLElement;
    private pageInstances: Record<string, PageComponent>;
    private cartItemCount: number = 0;

    constructor() {
        this.appElement = document.getElementById('app')!; 
        if (!this.appElement) {
            console.error('Fatal Error: Could not find #app element in index.html!');
            return;
        }
        
        // Create instances of all pages
        this.pageInstances = {
            'home': new HomePage(),
            'about': new AboutPage(),
            'store': new StorePage(),
            'sign-in': new LoginPage(),
            'cart': new CartPage()
        };

        this.checkAuthStatus();

        // Listen for hash changes to handle navigation
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.replace('#', '') || 'home';
            this.loadPage(page);
        });

        const initialPage = window.location.hash.replace('#', '') || 'home';
        this.loadPage(initialPage);

        // Listen for cart updates from CartPage
        window.addEventListener('cartUpdated', () => {
            this.updateCartCount();
        });
    }

    private attachStoreFilters(): void {
        const filterButtons = document.querySelectorAll('.filter-bar button');
        const products = document.querySelectorAll('.product-item');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                products.forEach(product => {
                    const tags = product.getAttribute('data-tags')?.split(',') || [];
                    if (filter === 'all' || tags.includes(filter!)) {
                        (product as HTMLElement).style.display = 'block';
                    } else {
                        (product as HTMLElement).style.display = 'none';
                    }
                });
            });
        });
    }

    private attachCartListeners(): void {
        const cartButtons = document.querySelectorAll('.add-to-cart');
        console.log(`Attaching listeners to ${cartButtons.length} 'Add to Cart' buttons.`);

        cartButtons.forEach(button => {
            const handler = async (e: Event) => {
                e.preventDefault();
                
                // Get productId directly from the button's data attribute
                const productId = (button as HTMLElement).dataset.productId;
                
                if (!productId) {
                    console.error('Product ID not found');
                    return;
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('Please log in to add items to your cart.');
                    window.location.hash = '#sign-in';
                    return;
                }

                // Disable button during request
                const originalText = (button as HTMLButtonElement).textContent;
                (button as HTMLButtonElement).textContent = 'Adding...';
                (button as HTMLButtonElement).disabled = true;

                try {
                    const response = await fetch('http://localhost:3001/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            product_id: parseInt(productId),
                            quantity: 1
                        })
                    });

                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                        alert('Your session has expired. Please log in again.');
                        window.location.hash = '#sign-in';
                        return;
                    }

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }

                    const data = await response.json();
                    console.log('Item added to cart:', data);
                    
                    // Show success feedback
                    (button as HTMLButtonElement).textContent = 'Added!';
                    setTimeout(() => {
                        (button as HTMLButtonElement).textContent = originalText;
                        (button as HTMLButtonElement).disabled = false;
                    }, 1000);

                    // Update cart count after adding item
                    await this.updateCartCount();
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add item to cart. Please try again.');
                    (button as HTMLButtonElement).textContent = originalText;
                    (button as HTMLButtonElement).disabled = false;
                }
            };

            if (!(button as any)._cartListenerAttached) {
                button.addEventListener('click', handler);
                (button as any)._cartListenerAttached = true;
            }
        });
    }

    private setupNavigation(): void {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) {
            console.warn('Nav menu not found, skipping setup.');
            return;
        }

        navMenu.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            // Check if nav-link was clicked
            if (target.classList.contains('nav-link')) {
                e.preventDefault();
                const page = target.getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                }
            }

            // Check if the logout button was clicked
            if (target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });
    }

    private checkAuthStatus(): void {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.updateNavigationForLoggedInUser(JSON.parse(user));
        } else {
            this.updateNavigationForLoggedOutUser();
        }
        
        this.setupNavigation();
    }

    private updateNavigationForLoggedInUser(user: any): void {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.innerHTML = `
                <li class="nav-item">
                    <a href="#home" class="nav-link" data-page="home">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#store" class="nav-link" data-page="store">Shop</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-page="about">About Us</a>
                </li>
                <li class="nav-item">
                    <span class="nav-user">Welcome, ${user.name}</span>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" id="logoutBtn" data-page="logout">Logout</a>
                </li>
            `;
        }
        
        // Add cart icon button
        this.addCartButton();
        this.updateCartCount();
    }

    private updateNavigationForLoggedOutUser(): void {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.innerHTML = `
                <li class="nav-item">
                    <a href="#home" class="nav-link" data-page="home">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#sign-in" class="nav-link" data-page="sign-in">Log In/Sign Up</a>
                </li>
                <li class="nav-item">
                    <a href="#store" class="nav-link" data-page="store">Shop</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-page="about">About Us</a>
                </li>
            `;
        }
        
        // Add cart icon button (users can still view cart)
        this.addCartButton();
        this.updateCartCount();
    }

    private logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateNavigationForLoggedOutUser();
        this.loadPage('home');
    }

    private async loadPage(page: string): Promise<void> {
        console.log('Loading page:', page);
        this.currentPage = page;
        
        // Handle product detail pages (e.g., #product/123)
        if (page.startsWith('product/')) {
            const productDetailPage = new ProductDetailPage();
            this.appElement.innerHTML = productDetailPage.render();
            await productDetailPage.initPage();
            if (typeof productDetailPage.attachEventListeners === 'function') {
                productDetailPage.attachEventListeners();
            }
            return;
        }

        window.location.hash = page;

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        const pageInstance = this.pageInstances[page];

        if (!pageInstance) {
            console.log('Page not found:', page);
            this.appElement.innerHTML = '<h1>404 - Page not found</h1>';
            return;
        }

        this.appElement.innerHTML = pageInstance.render();

        if (typeof pageInstance.initPage === 'function') {
            await pageInstance.initPage();
        }

        if (typeof pageInstance.attachEventListeners === 'function') {
            pageInstance.attachEventListeners();
        }

        if (page === 'store') {
            this.attachStoreFilters();
            this.attachCartListeners(); 
        }

        // Update cart count when navigating to cart or store pages
        if (page === 'cart' || page === 'store') {
            await this.updateCartCount();
        }
    }

    private addCartButton(): void {
        // Remove existing cart button if it exists
        const existingCartBtn = document.getElementById('cart-icon-btn');
        if (existingCartBtn) {
            existingCartBtn.remove();
        }

        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

        const cartButton = document.createElement('div');
        cartButton.id = 'cart-icon-btn';
        cartButton.className = 'cart-icon-container';
        cartButton.innerHTML = `
            <a href="#cart" class="cart-icon-link" data-page="cart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
                </svg>
                <span id="cart-count-badge" class="cart-count-badge" style="display: ${this.cartItemCount > 0 ? 'inline-block' : 'none'}">${this.cartItemCount > 0 ? this.cartItemCount : ''}</span>
            </a>
        `;

        // Insert before nav-menu
        const navMenu = navContainer.querySelector('.nav-menu');
        if (navMenu) {
            navContainer.insertBefore(cartButton, navMenu);
        } else {
            navContainer.appendChild(cartButton);
        }

        // Add click handler
        const cartLink = cartButton.querySelector('.cart-icon-link');
        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPage('cart');
            });
        }
    }

    private async updateCartCount(): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            this.cartItemCount = 0;
            this.updateCartBadge();
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.cartItemCount = data.items?.length || 0;
            } else {
                this.cartItemCount = 0;
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            this.cartItemCount = 0;
        }

        this.updateCartBadge();
    }

    private updateCartBadge(): void {
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
            if (this.cartItemCount > 0) {
                badge.textContent = this.cartItemCount.toString();
                badge.style.display = 'inline-block';
            } else {
                badge.textContent = '';
                badge.style.display = 'none';
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}