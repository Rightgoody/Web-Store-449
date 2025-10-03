export class AboutPage {
    render(): string {
        return `
            <div class="about-hero">
                <div class="container">
                    <h1>About Us</h1>
                    <p class="about-subtitle">Learn more about our story and mission</p>
                </div>
            </div>
            
            <div class="about-content">
                <div class="container">
                    <div class="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Founded with a vision to provide exceptional shopping experiences, 
                            our store has been serving customers with dedication and care. 
                            We believe in offering quality products at competitive prices 
                            while maintaining the highest standards of customer service.
                        </p>
                    </div>
                    
                    <div class="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            To make shopping convenient, enjoyable, and accessible for everyone. 
                            We strive to curate the best products and provide outstanding 
                            customer service that exceeds expectations.
                        </p>
                    </div>
                    
                    <div class="about-section">
                        <h2>Our Values</h2>
                        <div class="values-grid">
                            <div class="value-item">
                                <h3>Quality</h3>
                                <p>We carefully select every product to ensure the highest quality standards.</p>
                            </div>
                            <div class="value-item">
                                <h3>Customer First</h3>
                                <p>Our customers are at the heart of everything we do.</p>
                            </div>
                            <div class="value-item">
                                <h3>Innovation</h3>
                                <p>We continuously improve our services and shopping experience.</p>
                            </div>
                            <div class="value-item">
                                <h3>Trust</h3>
                                <p>Building lasting relationships through transparency and reliability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
