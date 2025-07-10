import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, Product } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
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

  products: Product[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'electronics',
      rating: 4.8,
      reviews: 1247,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 299.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'electronics',
      rating: 4.6,
      reviews: 892,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'clothing',
      rating: 4.4,
      reviews: 324
    },
    {
      id: 4,
      name: 'Professional Camera Lens',
      price: 599.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'electronics',
      rating: 4.9,
      reviews: 156,
      badge: 'Pro Choice'
    },
    {
      id: 5,
      name: 'Minimalist Desk Lamp',
      price: 89.99,
      originalPrice: 119.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'home',
      rating: 4.5,
      reviews: 678
    },
    {
      id: 6,
      name: 'Running Shoes',
      price: 129.99,
      image: '/placeholder.svg?height=300&width=300',
      category: 'sports',
      rating: 4.7,
      reviews: 2341,
      badge: 'Popular'
    }
  ];

  constructor(private cartService: CartService) {}

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      const matchesPrice = this.matchesPriceRange(product.price);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  matchesPriceRange(price: number): boolean {
    switch (this.selectedPriceRange) {
      case '0-50': return price < 50;
      case '50-100': return price >= 50 && price < 100;
      case '100-200': return price >= 100 && price < 200;
      case '200+': return price >= 200;
      default: return true;
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  generateStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
  }
}