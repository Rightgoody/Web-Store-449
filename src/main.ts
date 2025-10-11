import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StorePage } from './pages/StorePage';

class App {
    private currentPage: string = 'home';
    private appElement: HTMLElement;

    constructor() {
        this.appElement = document.getElementById('app')!;
        this.setupNavigation();
        this.loadPage('home');
    }

    private setupNavigation(): void {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = (e.target as HTMLElement).getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                }
            });
        });
    }

    private loadPage(page: string): void {
        this.currentPage = page;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Load page content
        switch (page) {
            case 'home':
                this.appElement.innerHTML = new HomePage().render();
                break;
            case 'about':
                this.appElement.innerHTML = new AboutPage().render();
                break;
            case 'store':
                this.appElement.innerHTML = new StorePage().render();
                break;
            default:
                this.appElement.innerHTML = '<h1>Page not found</h1>';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
