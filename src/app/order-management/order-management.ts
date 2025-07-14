import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { app } from '../firebase';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';

/* ────────── data models ────────── */
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

export interface Customer {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface AdminOrder {
  id: string;
  createdAt: Date;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: Customer;
}

/* ────────── component ────────── */
@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.css']
})
export class OrderManagementComponent implements OnInit {
  orders: AdminOrder[] = [];
  loading = true;
  error: string | null = null;
  activeDropdown: string | null = null;

  private firestore = getFirestore(app);

  constructor(private router: Router) {}

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    this.loadOrders();
  }

  /* ---------- data load ---------- */
  async loadOrders(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.orders = [];

    try {
      const orderSnap = await getDocs(collection(this.firestore, 'orders'));

      /* Grab every distinct userId so we can fetch user docs in parallel */
      const userIds = Array.from(
        new Set(orderSnap.docs.map((d) => (d.data() as any).userId as string))
      );

      const userMap: Record<string, Customer> = {};
      await Promise.all(
        userIds.map(async (uid) => {
          try {
            const uDoc = await getDoc(doc(this.firestore, 'users', uid));
            const u = uDoc.exists() ? uDoc.data() : {};
            userMap[uid] = {
              uid,
              displayName: (u as any).displayName || 'Unknown',
              email: (u as any).email || 'unknown@email.com',
              photoURL: (u as any).photoURL || undefined
            };
          } catch {
            userMap[uid] = {
              uid,
              displayName: 'Unknown',
              email: 'unknown@email.com'
            };
          }
        })
      );

      /* Build AdminOrder list */
      this.orders = orderSnap.docs
        .map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            createdAt:
              (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            items: (data.items || []) as OrderItem[],
            total: data.total ?? 0,
            status: data.status ?? 'pending',
            customer: userMap[data.userId] || {
              uid: data.userId,
              displayName: 'Unknown',
              email: 'unknown@email.com'
            }
          } as AdminOrder;
        })
        .sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime() /* newest first */
        );

      this.loading = false;
    } catch (err) {
      console.error('Order-management load error:', err);
      this.error = 'Failed to load orders. Please try again.';
      this.loading = false;
    }
  }

  /* ---------- helpers ---------- */
  getTotalItems(o: AdminOrder): number {
    return o.items.reduce((s, i) => s + i.quantity, 0);
  }

  generateStars(rating: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;

    for (let i = 0; i < full; i++) stars.push('★');
    if (half) stars.push('☆');
    while (stars.length < 5) stars.push('☆');
    return stars;
  }

  /* ---------- dropdown handling ---------- */
  toggleDropdown(orderId: string, ev: Event): void {
    ev.stopPropagation();
    this.activeDropdown = this.activeDropdown === orderId ? null : orderId;
  }
  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  /* ---------- actions ---------- */
  async updateOrderStatus(order: AdminOrder, newStatus: string): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, 'orders', order.id), {
        status: newStatus
      });
      order.status = newStatus as any;
      alert(`Order ${order.id} status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Order status update error:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      this.closeDropdowns();
    }
  }

  /* stub views – future expansion */
  viewCustomerDetails(c: Customer) {
    alert(`Customer:\n${c.displayName}\n${c.email}`);
    this.closeDropdowns();
  }
  viewOrderDetails(o: AdminOrder) {
    alert(`Order #${o.id}\n${o.items.length} items\nTotal $${o.total}`);
    this.closeDropdowns();
  }

  /* ---------- navigation ---------- */
  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
