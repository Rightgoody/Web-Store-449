export class AboutPage {
    render(): string {
        return `
            <div class="about-hero">
                <div class="container">
                    <h1>About Us</h1>
                    <p class="about-subtitle">Learn more about who we are and what we stand for</p>
                </div>
            </div>
            
            <div class="about-content">
                <div class="container">
                    <div class="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Founded with a passion for style and everyday wear, 
                            our store was created to bring versatile fashion to everyone. 
                            From timeless formalwear to relaxed casuals and active sportswear, 
                            we design collections that fit seamlessly into modern life. 
                            Every piece reflects our belief that clothing should be both practical and inspiring. 
                        </p>
                    </div>
                    
                    <div class="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            To make fashion simple, accessible, and dependable. 
                            We aim to provide clothing that looks great, feels comfortable, 
                            and empowers people to express themselves—whether at work, at play, 
                            or anywhere in between. Our mission is to help you dress for every moment. 
                        </p>
                    </div>

                    <div class="about-section">
                        <h2>Your Assistant</h2>
                        <p>
                            Our store features a built-in AI assistant who curates items according 
                            to your needs. Tired of scrolling trying to find the product for you?
                            Our assistant is ready to find your perfect fit. Have a special 
                            occasion approaching? Use our AI assistant to ensure you look your 
                            best. Need to find the perfect gift for a special someone? Have our AI
                            assistant give you ideas. Elevate your shopping experience today.
                        </p>
                    </div>
                    
                    <div class="about-section">
                        <h2>Our Values</h2>
                        <div class="values-grid">
                            <div class="value-item">
                                <h3>Quality</h3>
                                <p>We craft and curate clothing designed to last, using materials chosen with care.</p>
                            </div>
                            <div class="value-item">
                                <h3>Customer First</h3>
                                <p>Your lifestyle inspires our collections—everything begins with you.</p>
                            </div>
                            <div class="value-item">
                                <h3>Innovation</h3>
                                <p>We keep style fresh by blending modern design with everyday functionality.</p>
                            </div>
                            <div class="value-item">
                                <h3>Trust</h3>
                                <p>We stand by our products and our promise to make fashion honest and reliable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
