import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, Product as CartProduct } from '../services/cart.service';
import { ProductService, Product as FirestoreProduct } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  selectedPriceRange = 'all';

  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'books', name: 'Books' },
    { id: 'sports', name: 'Sports' }
  ];

  priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-50', name: 'Under $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100-200', name: '$100 - $200' },
    { id: '200+', name: '$200+' }
  ];

  products: CartProduct[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  /** Fetches every product from Firestore and adapts it to the existing card interface */
  async ngOnInit(): Promise<void> {
    try {
      const firestoreProducts: FirestoreProduct[] = await this.productService.getAllProducts();

      // Map Firestore data to the Product interface used in the cards
      this.products = firestoreProducts.map((p) => ({
        id: p.id as number | string,              // Cart service accepts number, keep as string OK
        name: p.name,
        price: p.price,
        originalPrice: undefined,                 // not stored yet
        image: p.imageUrl,
        category: p.category.toLowerCase(),
        rating: 4.0,                              // placeholder
        reviews: 324,                             // placeholder
        badge: undefined                          // none for now
      })) as CartProduct[];
    } catch (error) {
      console.error(error);
      this.products = [];
    }
  }

  /** ----- Existing logic below stays unchanged ----- */
  get filteredProducts(): CartProduct[] {
    return this.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.category === this.selectedCategory;
      const matchesPrice = this.matchesPriceRange(product.price);
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  matchesPriceRange(price: number): boolean {
    switch (this.selectedPriceRange) {
      case '0-50':
        return price < 50;
      case '50-100':
        return price >= 50 && price < 100;
      case '100-200':
        return price >= 100 && price < 200;
      case '200+':
        return price >= 200;
      default:
        return true;
    }
  }

  addToCart(product: CartProduct): void {
    this.cartService.addToCart(product);
  }

  generateStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) stars.push('★');
    if (hasHalfStar) stars.push('☆');
    while (stars.length < 5) stars.push('☆');

    return stars;
  }
}
