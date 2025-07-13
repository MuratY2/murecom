import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService, CartItem } from '../services/cart.service';

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { app } from '../firebase';
import { AuthService } from '../services/auth.service';

/* ---------- form helpers (visual only) ---------- */
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
  private firestore = getFirestore(app);

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  /* ---------- cart helpers ---------- */
  get cartItems(): CartItem[] {
    return this.cart.getCartItems();
  }
  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
  }
  get shipping(): number {
    return 0; // always free for now
  }
  get total(): number {
    return this.subtotal + this.shipping;
  }

  /* ---------- dummy form models ---------- */
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

  /* ---------- cart actions ---------- */
  updateQuantity(id: string | number, q: number) {
    this.cart.updateQuantity(id, q);
  }
  removeItem(id: string | number) {
    this.cart.removeFromCart(id);
  }

  /* ---------- order processing ---------- */
  async processCheckout(): Promise<void> {
    if (!this.cartItems.length || this.processing) return;

    this.processing = true;

    try {
      await addDoc(collection(this.firestore, 'orders'), {
        userId: this.auth.currentUser?.uid ?? null,
        items: JSON.parse(JSON.stringify(this.cartItems)), // clone
        subtotal: this.subtotal,
        shipping: this.shipping,
        total: this.total,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      /* clear cart */
      this.cart.clearCart();

      alert('✅ Your order has been placed!');

      this.router.navigate(['/']);
    } catch (err) {
      console.error('Order error:', err);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      this.processing = false;
    }
  }

  /* ---------- nav ---------- */
  goBack() {
    this.router.navigate(['/']);
  }
}
