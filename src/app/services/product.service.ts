import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase'; // Assuming firebase.ts is in the parent directory
import { AuthService } from './auth.service'; // Assuming auth.service.ts is in the same directory

export interface Product {
  id?: string; // Firestore auto-generates this
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected'; // Default to 'pending'
  sellerId: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = getFirestore(app);
  private productsCollection = collection(this.firestore, 'products');

  constructor(private authService: AuthService) {}

  async addProduct(productData: Omit<Product, 'id' | 'status' | 'sellerId' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      throw new Error('User not logged in. Cannot upload product.');
    }

    const newProduct: Omit<Product, 'id'> = {
      ...productData,
      status: 'pending', // Default status as requested
      sellerId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await addDoc(this.productsCollection, newProduct);
      console.log('Product added successfully to Firestore!');
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to upload product. Please try again.');
    }
  }
}