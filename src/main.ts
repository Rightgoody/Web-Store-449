// src/main.ts

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StorePage } from './pages/StorePage';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';
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

        const initialPage = window.location.hash.replace('#', '') || 'home';
        this.loadPage(initialPage);
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
            const handler = (e: Event) => {
                e.preventDefault();
                
                const productElement = (button as HTMLElement).closest('.product-item');
                const productId = productElement ? (productElement as HTMLElement).dataset.productId : null;
                console.log(`Product ${productId} added to cart (logic to be implemented).`);

                console.log('Navigating to cart page...');
                this.loadPage('cart');
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
                    <a href="#cart" class="nav-link" data-page="cart">Cart</a>
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
                    <a href="#cart" class="nav-link" data-page="cart">Cart</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-page="about">About Us</a>
                </li>
            `;
        }
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
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}