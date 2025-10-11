export class StorePage {
    render(): string {
        return `
            <div class="about-hero">
                <div class="hero-content">
                    <h1>All Clothing</h1>
                </div>
            </div>

            <div class="store-content">
                <div class="container">
                    <div class="product-grid flexbox-grid">
                        <div class="product-item">
                            <div class="image-container">
                                <img src="https://ik.imagekit.io/c2o/prd/ik-seo/tr:n-original/4/c/8/8/4c883b480180432520fb059a6b99cd8c5dec30b8_Gildan_Heavy_Cotton_Adult_TShirt_213_638/Gildan_Heavy_Cotton_Adult_TShirt_213_638.jpg" alt="Gildan">
                            </div>
                            <h3>Gildan T-Shirt</h3>
                            <p class="product-price">$9.99</p>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                        
                        <div class="product-item">
                            <div class="image-container">
                                <img src="https://www.gap.com/webcontent/0055/633/889/cn55633889.jpg" alt="Gap">
                            </div>
                            <h3>Gap Modern Khakis</h3>
                            <p class="product-price">$29.99</p>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>

                        <div class="product-item">
                            <div class="image-container">
                                <img src="https://www.bigtopshirtshop.com/cdn/shop/files/P160_ash_flat_front_1000x1500.jpg?v=1734115633" alt="Hanes Sweatshirt">
                            </div>
                            <h3>Hanes EcoSmart Sweatshirt</h3>
                            <p class="product-price">$19.99</p>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-assistant-promo">
                <div class="container">
                    <h2>Need a personalized recommendation?</h2>
                    <p>Our AI assistant can help you find exactly what you're looking for. Try it now!</p>
                    <button class="cta-button">Chat with our AI</button>
                </div>
            </div>
        `;
    }
}