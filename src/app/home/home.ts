import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  /* filter / search state */
  searchQuery = '';
  selectedCategory = 'all';
  selectedPriceRange = 'all';

  /* categories & price ranges */
  categories = [
    { id: 'all',               name: 'All Categories' },
    { id: 'electronics',       name: 'Electronics' },
    { id: 'clothing',          name: 'Clothing' },
    { id: 'home & garden',     name: 'Home & Garden' },
    { id: 'sports & outdoors', name: 'Sports & Outdoors' },
    { id: 'books',             name: 'Books' },
    { id: 'toys & games',      name: 'Toys & Games' },
    { id: 'health & beauty',   name: 'Health & Beauty' },
    { id: 'automotive',        name: 'Automotive' }
  ];

  priceRanges = [
    { id: 'all',      name: 'All Prices' },
    { id: '0-50',     name: 'Under $50' },
    { id: '50-100',   name: '$50 - $100' },
    { id: '100-200',  name: '$100 - $200' },
    { id: '200-500',  name: '$200 - $500' },
    { id: '500-1000', name: '$500 - $1000' },
    { id: '1000+',    name: '$1000+' }
  ];

  products: CartProduct[] = [];

  constructor(
    private cart: CartService,
    private productsSrv: ProductService,
    private route: ActivatedRoute
  ) {}

  /* ---------- init ---------- */
  async ngOnInit(): Promise<void> {
    /* load products from Firestore */
    const raw: FirestoreProduct[] = await this.productsSrv.getAllProducts();
    this.products = raw.map(p => ({
      id: p.id!,
      name: p.name,
      price: p.price,
      image: p.imageUrl,
      category: p.category.toLowerCase(),
      rating: 4,
      reviews: 324
    })) as CartProduct[];

    /* read ?q= from URL */
    this.route.queryParamMap.subscribe(p => {
      this.searchQuery = p.get('q') || '';
    });
  }

  /* ---------- filtered list ---------- */
  get filteredProducts(): CartProduct[] {
    return this.products.filter(p => {
      const matchesSearch =
        !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'all' || p.category === this.selectedCategory;

      const matchesPrice = this.matchesPriceRange(p.price);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  private matchesPriceRange(price: number): boolean {
    switch (this.selectedPriceRange) {
      case '0-50':     return price < 50;
      case '50-100':   return price >= 50  && price < 100;
      case '100-200':  return price >= 100 && price < 200;
      case '200-500':  return price >= 200 && price < 500;
      case '500-1000': return price >= 500 && price < 1000;
      case '1000+':    return price >= 1000;
      default:         return true;
    }
  }

  /* ---------- actions ---------- */
  addToCart(p: CartProduct) {
    this.cart.addToCart(p);
  }
  generateStars(r: number): string[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.floor(r) ? '★' : '☆'));
  }
}
