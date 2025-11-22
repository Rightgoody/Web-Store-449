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

            // Fetch reviews for all products
            const productsWithReviews = await Promise.all(
                products.map(async (product) => {
                    try {
                        const reviewsResponse = await fetch(`http://localhost:3001/api/reviews/product/${product.id}`);
                        const reviews: Review[] = reviewsResponse.ok ? await reviewsResponse.json() : [];
                        return { product, reviews };
                    } catch (error) {
                        console.error(`Error fetching reviews for product ${product.id}:`, error);
                        return { product, reviews: [] };
                    }
                })
            );

            const productsHtml = productsWithReviews.map(({ product, reviews }) => {
                const tags = `${product.category.toLowerCase()}`;
                const averageRating = reviews.length > 0
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0';
                
                return `
                    <div class="product-item" data-tags="${tags}" data-product-id="${product.id}">
                        <div class="product-main-content">
                            <div class="image-container">
                                <img src="${product.image_url}" alt="${product.name}">
                            </div>
                            <h3>${product.name}</h3>
                            <p class="product-price">$${Number(product.price).toFixed(2)}</p>
                            <div class="product-rating-summary">
                                <div class="rating-stars-small">
                                    ${this.renderStars(parseFloat(averageRating))}
                                </div>
                                <span class="rating-text-small">${averageRating} (${reviews.length})</span>
                            </div>
                            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                            <button class="toggle-reviews-btn" data-product-id="${product.id}">
                                ${reviews.length > 0 ? `View Reviews (${reviews.length})` : 'Add Review'}
                            </button>
                        </div>
                        <div class="product-reviews-section" id="reviews-${product.id}" style="display: none;">
                            ${this.renderReviewsSection(product, reviews)}
                        </div>
                    </div>
                `;
            }).join('');

            gridContainer.innerHTML = productsHtml;

            // Attach event listeners
            this.attachReviewToggleListeners();
            this.attachReviewFormListeners();

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

    private renderReviewsSection(product: ApiProduct, reviews: Review[]): string {
        return `
            <div class="reviews-container">
                <h4>Reviews</h4>
                <div class="review-form-inline" id="review-form-${product.id}">
                    ${this.renderInlineReviewForm(product.id)}
                </div>
                <div class="reviews-list-inline" id="reviews-list-${product.id}">
                    ${reviews.length === 0 
                        ? '<p class="no-reviews-inline">No reviews yet. Be the first to review!</p>'
                        : reviews.map(review => this.renderInlineReview(review)).join('')
                    }
                </div>
            </div>
        `;
    }

    private renderInlineReviewForm(productId: number): string {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            return `
                <div class="review-login-prompt-inline">
                    <p>Please <a href="#sign-in">log in</a> to write a review.</p>
                </div>
            `;
        }

        return `
            <form class="review-form-inline-content" data-product-id="${productId}">
                <div class="form-group-inline">
                    <label for="review-rating-${productId}">Rating:</label>
                    <select id="review-rating-${productId}" name="rating" required>
                        <option value="">Select</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>
                <div class="form-group-inline">
                    <label for="review-comment-${productId}">Comment:</label>
                    <textarea id="review-comment-${productId}" name="comment" rows="2" placeholder="Share your thoughts..."></textarea>
                </div>
                <button type="submit" class="submit-review-btn-inline">Submit</button>
            </form>
        `;
    }

    private renderInlineReview(review: Review): string {
        return `
            <div class="review-item-inline" data-review-id="${review.id}">
                <div class="review-header-inline">
                    <strong>${review.user_name || 'Anonymous'}</strong>
                    <div class="review-rating-inline">
                        ${this.renderStars(review.rating)}
                    </div>
                    <span class="review-date-inline">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                ${review.comment ? `<p class="review-comment-inline">${review.comment}</p>` : ''}
            </div>
        `;
    }

    private attachReviewToggleListeners(): void {
        const toggleButtons = document.querySelectorAll('.toggle-reviews-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = (button as HTMLElement).dataset.productId;
                if (!productId) return;

                const reviewsSection = document.getElementById(`reviews-${productId}`);
                const reviewsList = document.getElementById(`reviews-list-${productId}`);
                if (reviewsSection) {
                    const isVisible = reviewsSection.style.display !== 'none';
                    reviewsSection.style.display = isVisible ? 'none' : 'block';
                    
                    // Get review count
                    const reviewCount = reviewsList 
                        ? reviewsList.querySelectorAll('.review-item-inline').length 
                        : 0;
                    
                    (button as HTMLButtonElement).textContent = isVisible 
                        ? (reviewCount > 0 ? `View Reviews (${reviewCount})` : 'Add Review')
                        : 'Hide Reviews';
                }
            });
        });
    }

    private attachReviewFormListeners(): void {
        const reviewForms = document.querySelectorAll('.review-form-inline-content');
        reviewForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const formElement = form as HTMLFormElement;
                const productId = parseInt(formElement.dataset.productId || '0');
                if (!productId) return;

                const formData = new FormData(formElement);
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

                const submitBtn = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                try {
                    const response = await fetch(`http://localhost:3001/api/reviews/product/${productId}`, {
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

                    const newReview = await response.json();
                    
                    // Add the new review to the list
                    const reviewsList = document.getElementById(`reviews-list-${productId}`);
                    if (reviewsList) {
                        const noReviewsMsg = reviewsList.querySelector('.no-reviews-inline');
                        if (noReviewsMsg) {
                            noReviewsMsg.remove();
                        }
                        
                        const reviewHtml = this.renderInlineReview(newReview);
                        reviewsList.insertAdjacentHTML('afterbegin', reviewHtml);
                    }

                    // Reset form
                    formElement.reset();
                    
                    // Reload page to update rating summary
                    await this.initPage();
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Failed to submit review. Please try again.');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
    }
}