import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  searchQuery = '';
  isCartOpen = false;
  isAccountMenuOpen = false;

  constructor(public cartService: CartService) {}

  get cartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  get cartTotal(): number {
    return this.cartService.getCartTotal();
  }

  get cartItems() {
    return this.cartService.getCartItems();
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    this.isAccountMenuOpen = false;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    this.isCartOpen = false;
  }

  closeDropdowns(): void {
    this.isCartOpen = false;
    this.isAccountMenuOpen = false;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}