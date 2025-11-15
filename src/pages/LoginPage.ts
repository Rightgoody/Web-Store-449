export class LoginPage {
    private isLoginMode: boolean = true;

    render(): string {
        return `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>${this.isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>${this.isLoginMode ? 'Sign in to your account' : 'Join us today'}</p>
                    </div>

                    <form class="auth-form" id="authForm">
                        ${!this.isLoginMode ? `
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                        ` : ''}
                        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>

                        <button type="submit" class="auth-button">
                            ${this.isLoginMode ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div class="auth-footer">
                        <p>
                            ${this.isLoginMode ? "Don't have an account?" : "Already have an account?"}
                            <a href="#" id="toggleMode" class="auth-link">
                                ${this.isLoginMode ? 'Sign up' : 'Sign in'}
                            </a>
                        </p>
                    </div>

                    <div id="authMessage" class="auth-message" style="display: none;"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners(): void {
        // Toggle between login and signup
        const toggleMode = document.getElementById('toggleMode');
        if (toggleMode) {
            toggleMode.addEventListener('click', (e) => {
                e.preventDefault();
                this.isLoginMode = !this.isLoginMode;
                this.rerender();
            });
        }

        // Handle form submission
        const authForm = document.getElementById('authForm') as HTMLFormElement;
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuth();
            });
        }
    }

    private async handleAuth(): Promise<void> {
        const formData = new FormData(document.getElementById('authForm') as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        // Show loading state
        const submitButton = document.querySelector('.auth-button') as HTMLButtonElement;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Loading...';
        submitButton.disabled = true;
        
        try {
            const endpoint = this.isLoginMode ? '/api/auth/login' : '/api/auth/register';
            const body = this.isLoginMode 
                ? { email, password }
                : { email, password, name };

            console.log('Sending auth request to:', endpoint, body);

            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('Auth response:', data);

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                this.showMessage('success', `Welcome ${data.user.name}!`);
                
                // Update navigation to show logged in state
                this.updateNavigation(true, data.user);
                
                // Redirect to home page after successful auth
                setTimeout(() => {
                    window.location.hash = '#home';
                }, 1500);
            } else {
                this.showMessage('error', data.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showMessage('error', 'Network error. Please check if the backend is running.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    private updateNavigation(isLoggedIn: boolean, user?: any): void {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            if (isLoggedIn && user) {
                // Update navigation for logged in user
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
                
                // Add logout functionality
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }
            } else {
                // Update navigation for logged out user
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
            }
        }
    }

    private logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateNavigation(false);
        this.showMessage('success', 'Logged out successfully');
        setTimeout(() => {
            window.location.hash = '#home';
        }, 1000);
    }

    private showMessage(type: 'success' | 'error', message: string): void {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.className = `auth-message ${type}`;
            messageEl.textContent = message;
            messageEl.style.display = 'block';
        }
    }

    private rerender(): void {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = this.render();
            this.attachEventListeners();
        }
    }
}
