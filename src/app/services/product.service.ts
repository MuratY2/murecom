import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { app } from '../firebase';
import { AuthService } from './auth.service';

export interface Product {
  id?: string;                     // Firestore auto-generates this
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  sellerId: string;
  createdAt: any;                  // Firebase Timestamp
  updatedAt: any;                  // Firebase Timestamp
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = getFirestore(app);
  private productsCollection = collection(this.firestore, 'products');

  constructor(private authService: AuthService) {}

  async addProduct(
    productData: Omit<
      Product,
      'id' | 'status' | 'sellerId' | 'createdAt' | 'updatedAt'
    >
  ): Promise<void> {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      throw new Error('User not logged in. Cannot upload product.');
    }

    const newProduct: Omit<Product, 'id'> = {
      ...productData,
      status: 'pending',
      sellerId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await addDoc(this.productsCollection, newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to upload product.');
    }
  }

  /** Returns every product regardless of status */
  async getAllProducts(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(this.productsCollection);
      const products: Product[] = [];
      snapshot.forEach((d) => {
        products.push({ id: d.id, ...d.data() } as Product);
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products.');
    }
  }

  async getPendingProducts(): Promise<Product[]> {
    try {
      const q = query(this.productsCollection, where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      const products: Product[] = [];
      snapshot.forEach((d) => {
        products.push({ id: d.id, ...d.data() } as Product);
      });
      return products;
    } catch (error) {
      console.error('Error fetching pending products:', error);
      throw new Error('Failed to load pending products.');
    }
  }

  async updateProductStatus(
    productId: string,
    newStatus: 'approved' | 'rejected'
  ): Promise<void> {
    try {
      const productRef = doc(this.firestore, 'products', productId);
      await updateDoc(productRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error updating product ${productId} status:`, error);
      throw new Error(`Failed to update product status to ${newStatus}.`);
    }
  }
}
