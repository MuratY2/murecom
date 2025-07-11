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
  /* search bar text */
  searchQuery = '';

  isCartOpen = false;
  isAccountMenuOpen = false;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  /* ---------- navigation helpers ---------- */
  navigateHome() {
    this.closeDropdowns();
    this.router.navigate(['/']);
  }

  performSearch() {
    this.closeDropdowns();
    this.router.navigate(['/'], {
      queryParams: { q: this.searchQuery || null }
    });
  }

  goToCheckout() {
    this.closeDropdowns();
    this.router.navigate(['/checkout']);
  }

  /* ---------- cart getters & actions ---------- */
  get cartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
  get cartTotal(): number {
    return this.cartService.getCartTotal();
  }
  get cartItems() {
    return this.cartService.getCartItems();
  }
  updateQuantity(id: number | string, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }
  removeFromCart(id: number | string) {
    this.cartService.removeFromCart(id);
  }

  /* ---------- auth helpers ---------- */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get currentUser() {
    return this.authService.currentUser;
  }
  get userData() {
    return this.authService.userData;
  }

  /* user-type button text + action */
  get userTypeButton(): { text: string; action: string } {
    const t = this.userData?.userType || 'buyer';
    if (t === 'seller') return { text: 'Upload Product', action: 'upload-product' };
    if (t === 'admin')  return { text: 'Admin Dashboard', action: 'admin-dashboard' };
    return { text: 'Become a Seller', action: 'become-seller' };
  }

  /* ---------- dropdown toggles ---------- */
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    this.isAccountMenuOpen = false;
  }
  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    this.isCartOpen = false;
  }
  closeDropdowns() {
    this.isCartOpen = false;
    this.isAccountMenuOpen = false;
  }

  /* ---------- account nav ---------- */
  navigateToLogin() {
    this.closeDropdowns();
    this.router.navigate(['/login']);
  }
  navigateToSignup() {
    this.closeDropdowns();
    this.router.navigate(['/signup']);
  }
  navigateToProfile() {
    this.closeDropdowns();
    this.router.navigate(['/profile']);
  }

  /* ---------- user-type button handler ---------- */
  handleUserTypeAction() {
    const action = this.userTypeButton.action;

    switch (action) {
      case 'become-seller':
        this.router.navigate(['/become-seller']);
        break;
      case 'upload-product':
        this.router.navigate(['/upload-product']);
        break;
      case 'admin-dashboard':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  /* ---------- sign-out ---------- */
  async signOut() {
    try {
      await this.authService.signOut();
      this.closeDropdowns();
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
}
