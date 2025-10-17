import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StorePage } from './pages/StorePage';
import { LoginPage } from './pages/LoginPage';

class App {
    private currentPage: string = 'home';
    private appElement: HTMLElement;

    constructor() {
        this.appElement = document.getElementById('app')!;
        this.checkAuthStatus();
        
        // Setup navigation after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupNavigation();
        }, 100);
        
        this.loadPage('home');
    }

    private setupNavigation(): void {
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Setting up navigation for', navLinks.length, 'links');
        
        // Remove existing event listeners to prevent duplicates
        navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick);
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
    }
    
    private handleNavClick = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const page = target.getAttribute('data-page');
        console.log('Navigation clicked:', page);
        if (page) {
            this.loadPage(page);
        }
    }

    private checkAuthStatus(): void {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            // User is logged in, update navigation
            this.updateNavigationForLoggedInUser(JSON.parse(user));
        } else {
            // User is not logged in, show default navigation
            this.updateNavigationForLoggedOutUser();
        }
    }

    private updateNavigationForLoggedInUser(user: any): void {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.innerHTML = `
                <li class="nav-item">
                    <a href="#home" class="nav-link" data-page="home">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#shop" class="nav-link" data-page="store">Shop</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-page="about">About Us</a>
                </li>
                <li class="nav-item">
                    <span class="nav-user">Welcome, ${user.name}</span>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" id="logoutBtn">Logout</a>
                </li>
            `;
            
            // Reattach navigation event listeners
            this.setupNavigation();
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
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
                    <a href="#log-in" class="nav-link" data-page="sign-in">Log In/Sign Up</a>
                </li>
                <li class="nav-item">
                    <a href="#shop" class="nav-link" data-page="store">Shop</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-page="about">About Us</a>
                </li>
            `;
            
            // Reattach navigation event listeners
            this.setupNavigation();
        }
    }

    private logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateNavigationForLoggedOutUser();
        this.loadPage('home');
    }

    private loadPage(page: string): void {
        console.log('Loading page:', page);
        this.currentPage = page;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Load page content
        switch (page) {
            case 'home':
                console.log('Loading home page');
                this.appElement.innerHTML = new HomePage().render();
                break;
            case 'about':
                console.log('Loading about page');
                this.appElement.innerHTML = new AboutPage().render();
                break;
            case 'store':
                console.log('Loading store page');
                this.appElement.innerHTML = new StorePage().render();
                break;
            case 'sign-in':
                console.log('Loading login page');
                const loginPage = new LoginPage();
                this.appElement.innerHTML = loginPage.render();
                loginPage.attachEventListeners();
                break;
            default:
                console.log('Page not found:', page);
                this.appElement.innerHTML = '<h1>Page not found</h1>';
        }
    }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app...');
        new App();
    });
} else {
    console.log('DOM already loaded, initializing app immediately...');
    new App();
}
