interface ApiProduct {
    id: number;
    name: string;
    description: string;
    price: string; 
    image_url: string;
    category: string;
    stock: number;
}

export class StorePage {
    render(): string {
        return `
            <div class="about-hero">
                <div class="hero-content">
                    <h1>All Clothing</h1>
                </div>
            </div>

            <div class="store-content">
                <div class="filter-bar">
                    <button data-filter="all">All</button>
                    <button data-filter="shirt">Shirts</button>
                    <button data-filter="pants">Pants</button>
                    <button data-filter="sweatshirt">Sweatshirts</button>
                </div>

                <div class="container">
                    <!-- 
                      This grid is now empty, but has an ID.
                      initPage() will find this ID and inject product HTML here. 
                    -->
                    <div class="product-grid flexbox-grid" id="product-grid-container">
                        <p class="loading-message">Loading products from the database...</p>
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

    async initPage(): Promise<void> {
        const gridContainer = document.getElementById('product-grid-container');
        if (!gridContainer) {
            console.error('StorePage Error: Could not find product grid container.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/products');
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const products: ApiProduct[] = await response.json();

            if (products.length === 0) {
                gridContainer.innerHTML = '<p>No products are currently available.</p>';
                return;
            }

            const productsHtml = products.map(product => {
                const tags = `${product.category.toLowerCase()}`; 
                
                return `
                    <div class="product-item" data-tags="${tags}">
                        <div class="image-container">
                            <img src="${product.image_url}" alt="${product.name}">
                        </div>
                        <h3>${product.name}</h3>
                        <p class="product-price">$${Number(product.price).toFixed(2)}</p>
                        <!-- Add data-product-id so your cart script knows what was added -->
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                `;
            }).join('');

            gridContainer.innerHTML = productsHtml;

        } catch (error) {
            console.error('Error fetching products:', error);
            gridContainer.innerHTML = `
                <p class="error-message">
                    <strong>Error: Could not load products.</strong><br>
                    Please ensure the backend server is running and the database is migrated.
                </p>
            `;
        }
    }
}