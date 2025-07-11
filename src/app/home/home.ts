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

  /** Pull everything from Firestore, no undefined fields */
  async ngOnInit(): Promise<void> {
    try {
      const raw: FirestoreProduct[] = await this.productService.getAllProducts();
      this.products = raw.map((p) => ({
        id: p.id as string | number,
        name: p.name,
        price: p.price,
        image: p.imageUrl,
        category: p.category.toLowerCase(),
        rating: 4,         // placeholder
        reviews: 324       // placeholder
      })) as CartProduct[];
    } catch (err) {
      console.error(err);
      this.products = [];
    }
  }

  /* ---------- view helpers ---------- */
  get filteredProducts(): CartProduct[] {
    return this.products.filter((p) => {
      const s = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const c =
        this.selectedCategory === 'all' || p.category === this.selectedCategory;
      return s && c && this.matchesPriceRange(p.price);
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

  addToCart(p: CartProduct): void {
    this.cartService.addToCart(p);
  }

  generateStars(r: number): string[] {
    const out: string[] = [];
    for (let i = 1; i <= 5; i++) out.push(i <= Math.floor(r) ? '★' : '☆');
    return out;
  }
}
