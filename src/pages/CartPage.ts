
export class CartPage {
    render(): string {
        const mockCartItems = [
            {
                name: "Gildan T-Shirt",
                price: 9.99,
                quantity: 2,
                image: "https://ik.imagekit.io/c2o/prd/ik-seo/tr:n-original/4/c/8/8/4c883b480180432520fb059a6b99cd8c5dec30b8_Gildan_Heavy_Cotton_Adult_TShirt_213_638/Gildan_Heavy_Cotton_Adult_TShirt_213_638.jpg",
                alt: "Gildan T-Shirt"
            },
            {
                name: "Gap Modern Khakis",
                price: 29.99,
                quantity: 1,
                image: "https://www.gap.com/webcontent/0055/633/889/cn55633889.jpg",
                alt: "Gap Khakis"
            }
        ];

        const itemsHtml = mockCartItems.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.alt}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="product-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <label for="qty-${item.name.replace(' ', '')}">Quantity:</label>
                        <input type="number" id="qty-${item.name.replace(' ', '')}" value="${item.quantity}" min="1">
                    </div>
                </div>
                <div class="cart-item-total">
                    <p class="product-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item-btn">Remove</button>
                </div>
            </div>
        `).join('');

        const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

                    ${mockCartItems.length > 0 ? `
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
            </div>
        `;
    }
}