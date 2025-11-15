interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product_name: string;
    product_price: number;
    product_image_url: string;
    total_price: number;
}

interface CartResponse {
    items: CartItem[];
    total: string;
}

export class CartPage {
    private cartItems: CartItem[] = [];
    private cartTotal: number = 0;
    private isLoading: boolean = true;
    private error: string | null = null;

    render(): string {
        const itemsHtml = this.cartItems.map(item => {
            // Ensure prices are numbers
            const productPrice = typeof item.product_price === 'string' 
                ? parseFloat(item.product_price) 
                : Number(item.product_price);
            const totalPrice = typeof item.total_price === 'string' 
                ? parseFloat(item.total_price) 
                : Number(item.total_price);
            
            return `
            <div class="cart-item" data-product-id="${item.product_id}">
                <div class="cart-item-image">
                    <img src="${item.product_image_url}" alt="${item.product_name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.product_name}</h3>
                    <p class="product-price">$${isNaN(productPrice) ? '0.00' : productPrice.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <label for="qty-${item.product_id}">Quantity:</label>
                        <input type="number" id="qty-${item.product_id}" value="${item.quantity}" min="1" data-product-id="${item.product_id}">
                    </div>
                </div>
                <div class="cart-item-total">
                    <p class="product-price">$${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}</p>
                    <button class="remove-item-btn" data-product-id="${item.product_id}">Remove</button>
                </div>
            </div>
        `;
        }).join('');

        // Ensure total_price is converted to number before summing
        const subtotal = this.cartItems.reduce((sum, item) => {
            const price = typeof item.total_price === 'string' 
                ? parseFloat(item.total_price) 
                : Number(item.total_price);
            return sum + (isNaN(price) ? 0 : price);
        }, 0);
        const shipping = 4.99;
        const total = subtotal + shipping;

        return `
            <div class="about-hero">
                <div class="hero-content">
                    <h1>Your Shopping Cart</h1>
                </div>
            </div>

            <div class="cart-page-content">
                <div class="container">
                    <div id="cart-loading" style="text-align: center; padding: 2rem; ${this.isLoading ? '' : 'display: none;'}">
                        <p>Loading cart...</p>
                    </div>
                    <div id="cart-content" style="${this.isLoading || this.error ? 'display: none;' : ''}">
                        ${this.cartItems.length > 0 ? `
                            <!-- Cart Layout: Items on Left, Summary on Right -->
                            <div class="cart-grid">
                                
                                <!-- Column 1: List of Items -->
                                <div class="cart-items-list">
                                    <h2>Your Items</h2>
                                    ${itemsHtml}
                                </div>

                                <!-- Column 2: Order Summary -->
                                <div class="order-summary">
                                    <h2>Order Summary</h2>
                                    <div class="summary-line">
                                        <span>Subtotal</span>
                                        <span class="product-price">$${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div class="summary-line">
                                        <span>Shipping</span>
                                        <span>$${shipping.toFixed(2)}</span>
                                    </div>
                                    <div class="summary-total">
                                        <span>Total</span>
                                        <span class="product-price">$${total.toFixed(2)}</span>
                                    </div>
                                    <button class="cta-button checkout-btn">Proceed to Checkout</button>
                                </div>

                            </div>
                        ` : `
                            <!-- Alternate View: Empty Cart -->
                            <div class="empty-cart-container">
                                <h2>Your cart is empty.</h2>
                                <p>Looks like you haven't added anything to your cart yet.</p>
                                <button class="cta-button" data-link="/store">Continue Shopping</button>
                            </div>
                        `}
                    </div>
                    <div id="cart-error" style="${this.error ? '' : 'display: none;'} text-align: center; padding: 2rem; color: red;">
                        <p id="error-message">${this.error || ''}</p>
                    </div>
                </div>
            </div>
        `;
    }

    async initPage(): Promise<void> {
        // Reset state when page loads
        this.isLoading = true;
        this.error = null;
        this.rerender(); // Show loading state immediately
        
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            this.error = 'Please log in to view your cart.';
            this.isLoading = false;
            this.rerender();
            setTimeout(() => {
                window.location.hash = '#sign-in';
            }, 2000);
            return;
        }

        try {
            console.log('Fetching cart data...');
            
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('http://localhost:3001/api/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            console.log('Cart API response status:', response.status);

            if (response.status === 401 || response.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                this.error = 'Your session has expired. Please log in again.';
                this.isLoading = false;
                this.rerender();
                setTimeout(() => {
                    window.location.hash = '#sign-in';
                }, 2000);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Cart API error response:', errorText);
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data: CartResponse = await response.json();
            console.log('Cart data received:', data);
            
            // Ensure items array exists and handle potential string/number conversions
            this.cartItems = (data.items || []).map(item => ({
                ...item,
                product_price: typeof item.product_price === 'string' 
                    ? parseFloat(item.product_price) 
                    : Number(item.product_price),
                total_price: typeof item.total_price === 'string' 
                    ? parseFloat(item.total_price) 
                    : Number(item.total_price)
            }));
            
            this.cartTotal = typeof data.total === 'string' 
                ? parseFloat(data.total) 
                : Number(data.total);
            this.error = null;
            this.isLoading = false;
            this.rerender();

        } catch (error) {
            console.error('Error fetching cart:', error);
            let errorMessage = 'Could not load your cart. Please try again later.';
            
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please check your connection and try again.';
                } else {
                    errorMessage = `Could not load your cart: ${error.message}. Please try again later.`;
                }
            }
            
            this.error = errorMessage;
            this.isLoading = false;
            this.rerender();
        }
    }

    attachEventListeners(): void {
        // Quantity update listeners
        document.querySelectorAll('.cart-item-quantity input[type="number"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const productId = target.dataset.productId;
                const quantity = parseInt(target.value);
                
                if (productId && quantity > 0) {
                    this.updateCartItem(parseInt(productId), quantity);
                } else if (quantity <= 0) {
                    target.value = '1';
                }
            });
        });

        // Remove button listeners
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const productId = target.dataset.productId;
                
                if (productId) {
                    this.removeCartItem(parseInt(productId));
                }
            });
        });

        // Continue Shopping button
        const continueShoppingBtn = document.querySelector('[data-link="/store"]');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                window.location.hash = '#store';
            });
        }
    }

    private async updateCartItem(productId: number, quantity: number): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            this.showError('Please log in to update your cart.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/cart/update/${productId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                // Refresh cart data
                await this.initPage();
                // Notify App to update cart count
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const error = await response.json();
                this.showError(error.error || 'Failed to update cart item.');
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            this.showError('Failed to update cart item. Please try again.');
        }
    }

    private async removeCartItem(productId: number): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            this.showError('Please log in to remove items from your cart.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Refresh cart data
                await this.initPage();
                // Notify App to update cart count
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const error = await response.json();
                this.showError(error.error || 'Failed to remove item from cart.');
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            this.showError('Failed to remove item. Please try again.');
        }
    }

    private rerender(): void {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = this.render();
            this.attachEventListeners();
        }
    }

    private showError(message: string): void {
        this.error = message;
        const errorEl = document.getElementById('cart-error');
        const errorMessageEl = document.getElementById('error-message');
        const loadingEl = document.getElementById('cart-loading');
        const contentEl = document.getElementById('cart-content');
        
        if (loadingEl) loadingEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'block';
        if (errorMessageEl) errorMessageEl.textContent = message;
    }
}