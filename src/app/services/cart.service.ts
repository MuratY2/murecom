import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { app } from '../firebase';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { AuthService } from './auth.service';

/* ───────────────────────── models ───────────────────────── */
export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/* ───────────────────── cart service ─────────────────────── */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items$ = new BehaviorSubject<CartItem[]>([]);
  private firestore = getFirestore(app);
  private localKey = 'murecom_cart';

  constructor(private authService: AuthService) {
    /* reload cart whenever auth state changes */
    this.authService.currentUser$.subscribe(async (u) => {
      await this.loadCart(u?.uid || null);
    });
  }

  /* ---------- getters for UI ---------- */
  getCartItems(): CartItem[] {
    return this._items$.value;
  }
  getCartItemCount(): number {
    return this._items$.value.reduce((s, i) => s + i.quantity, 0);
  }
  getCartTotal(): number {
    return this._items$.value.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );
  }

  /* ---------- public actions ---------- */
  addToCart(product: Product): void {
    const items = [...this._items$.value];
    const idx = items.findIndex((i) => i.product.id === product.id);
    idx > -1 ? (items[idx].quantity += 1) : items.push({ product, quantity: 1 });
    this._items$.next(items);
    this.persistCart();
  }

  updateQuantity(id: string | number, qty: number): void {
    this._items$.next(
      this._items$.value.map((i) =>
        i.product.id === id ? { ...i, quantity: Math.max(qty, 1) } : i
      )
    );
    this.persistCart();
  }

  removeFromCart(id: string | number): void {
    this._items$.next(this._items$.value.filter((i) => i.product.id !== id));
    this.persistCart();
  }

  /** Clear the cart entirely (used after successful order) */
  clearCart(): void {
    this._items$.next([]);
    this.persistCart();
  }

  /* ---------- persistence ---------- */
  private async loadCart(uid: string | null): Promise<void> {
    try {
      if (uid) {
        const ref = doc(this.firestore, 'carts', uid);
        const snap = await getDoc(ref);
        this._items$.next(
          snap.exists() ? ((snap.data() as any)['items'] || []) : []
        );

        /* one-time merge of guest cart */
        const guest = this.getGuestCart();
        if (guest.length) {
          this._items$.next([...this._items$.value, ...guest]);
          localStorage.removeItem(this.localKey);
          await this.persistCart();
        }
      } else {
        this._items$.next(this.getGuestCart());
      }
    } catch (err) {
      console.error('Cart load error:', err);
      this._items$.next([]);
    }
  }

  private async persistCart(): Promise<void> {
    const uid = this.authService.currentUser?.uid || null;
    const items = this._items$.value;
    const clean = JSON.parse(JSON.stringify(items)); // strip undefined

    try {
      if (uid) {
        const ref = doc(this.firestore, 'carts', uid);
        await setDoc(
          ref,
          { items: clean, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } else {
        localStorage.setItem(this.localKey, JSON.stringify(clean));
      }
    } catch (err) {
      console.error('Cart save error:', err);
    }
  }

  private getGuestCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.localKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
