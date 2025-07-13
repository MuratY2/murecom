import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { app } from '../firebase';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';

import { AuthService } from '../services/auth.service';

/* ───────────────────────── models ───────────────────────── */
export interface OrderProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: Date;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  userId: string;
}

/* ───────────────────────── component ────────────────────── */
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  private firestore = getFirestore(app);
  private uid: string | null = null;
  private authSub!: Subscription;

  constructor(private router: Router, private auth: AuthService) {}

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    /* Wait for auth to settle – currentUser may be null on first tick */
    this.authSub = this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.fetchOrders();
      } else {
        this.orders = [];
        this.loading = false;
        this.error = 'You need to be logged in to view orders.';
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  /* ---------- data load ---------- */
  async fetchOrders(): Promise<void> {
    if (!this.uid) return;

    this.loading = true;
    this.error = null;
    this.orders = [];

    try {
      /* Simple filter – avoids composite-index requirement */
      const q = query(
        collection(this.firestore, 'orders'),
        where('userId', '==', this.uid)
      );
      const snap = await getDocs(q);

      this.orders = snap.docs
        .map((d) => {
          const data = d.data() as any;

          return {
            id: d.id,
            createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            items: (data.items || []) as OrderItem[],
            subtotal: data.subtotal ?? 0,
            shipping: data.shipping ?? 0,
            total: data.total ?? 0,
            status: data.status ?? 'pending',
            userId: data.userId
          } as Order;
        })
        .sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime() /* newest first */
        );

      this.loading = false;
    } catch (err) {
      console.error('Orders load error:', err);
      this.error = 'Failed to load orders. Please try again.';
      this.loading = false;
    }
  }

  /* ---------- helpers ---------- */
  getTotalItems(o: Order): number {
    return o.items.reduce((s, i) => s + i.quantity, 0);
  }

  generateStars(r: number): string[] {
    const out: string[] = [];
    const full = Math.floor(r);
    const half = r % 1 !== 0;

    for (let i = 0; i < full; i++) out.push('★');
    if (half) out.push('☆');
    while (out.length < 5) out.push('☆');
    return out;
  }

  /* ---------- nav ---------- */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /* ---------- retry button ---------- */
  loadOrders(): void {
    /* template retry button calls this */
    this.fetchOrders();
  }
}
