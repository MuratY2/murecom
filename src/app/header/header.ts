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

  /* ----- cart getters ----- */
  get cartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
  get cartTotal(): number {
    return this.cartService.getCartTotal();
  }
  get cartItems() {
    return this.cartService.getCartItems();
  }

  /* ----- auth getters ----- */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get currentUser() {
    return this.authService.currentUser;
  }
  get userData() {
    return this.authService.userData;
  }

  /* ----- UI helpers ----- */
  get userTypeButton(): { text: string; action: string } {
    const type = this.userData?.userType || 'buyer';
    switch (type) {
      case 'seller':
        return { text: 'Upload Product', action: 'upload-product' };
      case 'admin':
        return { text: 'Admin Dashboard', action: 'admin-dashboard' };
      default:
        return { text: 'Become a Seller', action: 'become-seller' };
    }
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

  /* ----- cart actions ----- */
  updateQuantity(id: number | string, q: number): void {
    this.cartService.updateQuantity(id, q);
  }
  removeFromCart(id: number | string): void {
    this.cartService.removeFromCart(id);
  }

  /* ----- navigation ----- */
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

  handleUserTypeAction() {
    this.router.navigate(['/', this.userTypeButton.action]);
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.closeDropdowns();
      this.router.navigate(['/']);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  }

  /** new: route user to /checkout */
  goToCheckout() {
    this.closeDropdowns();
    this.router.navigate(['/checkout']);
  }
}
