import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

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

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  get cartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  get cartTotal(): number {
    return this.cartService.getCartTotal();
  }

  get cartItems() {
    return this.cartService.getCartItems();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get currentUser() {
    return this.authService.currentUser;
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

  navigateToLogin(): void {
    this.closeDropdowns();
    this.router.navigate(['/login']);
  }

  navigateToSignup(): void {
    this.closeDropdowns();
    this.router.navigate(['/signup']);
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.closeDropdowns();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}