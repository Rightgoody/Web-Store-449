interface ApiProduct {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string;
    category: string;
    stock: number;
}

interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user_name?: string;
}

export class ProductDetailPage {
    private productId: number | null = null;

    render(): string {
        return `
            <div class="product-detail-container">
                <div class="container">
                    <div id="product-detail-content">
                        <p class="loading-message">Loading product details...</p>
                    </div>
                </div>
            </div>
        `;
    }

    async initPage(): Promise<void> {
        // Extract product ID from URL hash (e.g., #product/123)
        const hash = window.location.hash;
        const match = hash.match(/^#product\/(\d+)$/);
        
        if (!match) {
            const content = document.getElementById('product-detail-content');
            if (content) {
                content.innerHTML = '<p class="error-message">Invalid product ID.</p>';
            }
            return;
        }

        this.productId = parseInt(match[1]);
        await this.loadProduct();
    }

    private async loadProduct(): Promise<void> {
        if (!this.productId) return;

        const content = document.getElementById('product-detail-content');
        if (!content) return;

        try {
            // Fetch product details
            const productResponse = await fetch(`http://localhost:3001/api/products/${this.productId}`);
            
            if (!productResponse.ok) {
                throw new Error(`Failed to load product: ${productResponse.status}`);
            }

            const product: ApiProduct = await productResponse.json();

            // Fetch reviews
            const reviewsResponse = await fetch(`http://localhost:3001/api/reviews/product/${this.productId}`);
            const reviews: Review[] = reviewsResponse.ok ? await reviewsResponse.json() : [];

            // Render product details
            content.innerHTML = this.renderProductDetail(product, reviews);

            // Attach event listeners
            this.attachEventListeners();

        } catch (error) {
            console.error('Error loading product:', error);
            content.innerHTML = `
                <p class="error-message">
                    <strong>Error: Could not load product details.</strong><br>
                    Please ensure the backend server is running.
                </p>
            `;
        }
    }

    private renderProductDetail(product: ApiProduct, reviews: Review[]): string {
        const averageRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0';

        return `
            <a href="#store" class="back-link">← Back to Store</a>
            
            <div class="product-detail-layout">
                <div class="product-image-section">
                    <img src="${product.image_url}" alt="${product.name}" class="product-detail-image">
                </div>
                
                <div class="product-info-section">
                    <h1 class="product-detail-title">${product.name}</h1>
                    <p class="product-detail-category">${product.category}</p>
                    <p class="product-detail-price">$${Number(product.price).toFixed(2)}</p>
                    
                    <div class="product-rating-summary">
                        <div class="rating-stars">
                            ${this.renderStars(parseFloat(averageRating))}
                        </div>
                        <span class="rating-text">${averageRating} (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                    
                    <p class="product-detail-description">${product.description || 'No description available.'}</p>
                    <p class="product-stock">${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</p>
                    
                    <button class="add-to-cart-detail" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
            
            <div class="reviews-section">
                <h2>Customer Reviews</h2>
                
                <div id="review-form-container">
                    ${this.renderReviewForm()}
                </div>
                
                <div id="reviews-list" class="reviews-list">
                    ${reviews.length === 0 
                        ? '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>'
                        : reviews.map(review => this.renderReview(review)).join('')
                    }
                </div>
            </div>
        `;
    }

    private renderReviewForm(): string {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            return `
                <div class="review-login-prompt">
                    <p>Please <a href="#sign-in">log in</a> to write a review.</p>
                </div>
            `;
        }

        return `
            <div class="review-form">
                <h3>Write a Review</h3>
                <form id="review-form">
                    <div class="form-group">
                        <label for="review-rating">Rating</label>
                        <select id="review-rating" name="rating" required>
                            <option value="">Select a rating</option>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="review-comment">Comment</label>
                        <textarea id="review-comment" name="comment" rows="4" placeholder="Share your thoughts about this product..."></textarea>
                    </div>
                    <button type="submit" class="submit-review-btn">Submit Review</button>
                </form>
            </div>
        `;
    }

    private renderReview(review: Review): string {
        return `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-user">
                        <strong>${review.user_name || 'Anonymous'}</strong>
                        <div class="review-rating">
                            ${this.renderStars(review.rating)}
                        </div>
                    </div>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                ${review.comment ? `<p class="review-comment">${review.comment}</p>` : ''}
            </div>
        `;
    }

    private renderStars(rating: number): string {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">★</span>';
        }
        return stars;
    }

    private attachEventListeners(): void {
        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-detail');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const productId = (addToCartBtn as HTMLElement).dataset.productId;
                
                if (!productId) {
                    alert('Product ID not found');
                    return;
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('Please log in to add items to your cart.');
                    window.location.hash = '#sign-in';
                    return;
                }

                const button = addToCartBtn as HTMLButtonElement;
                const originalText = button.textContent;
                button.textContent = 'Adding...';
                button.disabled = true;

                try {
                    const response = await fetch('http://localhost:3001/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            product_id: parseInt(productId),
                            quantity: 1
                        })
                    });

                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                        alert('Your session has expired. Please log in again.');
                        window.location.hash = '#sign-in';
                        return;
                    }

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to add item to cart');
                    }

                    button.textContent = 'Added!';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 1000);

                    // Dispatch cart update event
                    window.dispatchEvent(new Event('cartUpdated'));
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add item to cart. Please try again.');
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });
        }

        // Review form submission
        const reviewForm = document.getElementById('review-form') as HTMLFormElement;
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!this.productId) return;

                const formData = new FormData(reviewForm);
                const rating = parseInt(formData.get('rating') as string);
                const comment = formData.get('comment') as string;

                if (!rating) {
                    alert('Please select a rating');
                    return;
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('Please log in to submit a review.');
                    window.location.hash = '#sign-in';
                    return;
                }

                const submitBtn = reviewForm.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                try {
                    const response = await fetch(`http://localhost:3001/api/reviews/product/${this.productId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            rating,
                            comment: comment || null
                        })
                    });

                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                        alert('Your session has expired. Please log in again.');
                        window.location.hash = '#sign-in';
                        return;
                    }

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to submit review');
                    }

                    // Reload product to show new review
                    await this.loadProduct();
                    
                    // Scroll to reviews section
                    document.querySelector('.reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Failed to submit review. Please try again.');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
}

