import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService, CartItem } from '../services/cart.service';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  /* cart items now come from CartService */
  constructor(private cart: CartService, private router: Router) {}

  get cartItems(): CartItem[] {
    return this.cart.getCartItems();
  }

  /* ----- simple totals (shipping always free, no tax) ----- */
  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
  }
  get shipping(): number {
    return 0;
  }
  get total(): number {
    return this.subtotal;
  }

  /* ----- checkout form models (unchanged visuals) ----- */
  shippingAddress: ShippingAddress = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  paymentMethod: PaymentMethod = {
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  };

  countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan'
  ];

  processing = false;

  /* ----- cart update helpers ----- */
  updateQuantity(id: string | number, q: number) {
    this.cart.updateQuantity(id, q);
  }
  removeItem(id: string | number) {
    this.cart.removeFromCart(id);
  }

  /* ----- fake checkout flow (demo only) ----- */
  async processCheckout() {
    if (!this.cartItems.length) return;

    this.processing = true;
    await new Promise((r) => setTimeout(r, 1500));
    alert('Order placed successfully! (Demo)');
    this.processing = false;
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
