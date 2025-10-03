export class HomePage {
    render(): string {
        return `
            <div class="hero-section">
                <div class="hero-content">
                    <h1>Welcome to Our Store</h1>
                    <p>Discover amazing products at great prices. Your one-stop destination for quality shopping.</p>
                    <button class="cta-button">Shop Now</button>
                </div>
            </div>
            
            <div class="features-section">
                <div class="container">
                    <h2>Why Choose Us?</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🚚</div>
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable shipping to your doorstep</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💎</div>
                            <h3>Quality Products</h3>
                            <p>Carefully curated items from trusted brands</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🛡️</div>
                            <h3>Secure Shopping</h3>
                            <p>Safe and secure payment processing</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
