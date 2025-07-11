import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit {
  pendingProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  async loadPendingProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.pendingProducts = await this.productService.getPendingProducts();
    } catch (err: any) {
      this.error = err.message || 'Failed to load products.';
    } finally {
      this.loading = false;
    }
  }

  async approveProduct(productId: string): Promise<void> {
    if (confirm('Are you sure you want to approve this product?')) {
      try {
        await this.productService.updateProductStatus(productId, 'approved');
        alert('Product approved successfully!');
        this.loadPendingProducts(); // Reload the list
      } catch (err: any) {
        alert(`Error approving product: ${err.message}`);
      }
    }
  }

  async rejectProduct(productId: string): Promise<void> {
    if (confirm('Are you sure you want to reject this product?')) {
      try {
        await this.productService.updateProductStatus(productId, 'rejected');
        alert('Product rejected successfully!');
        this.loadPendingProducts(); // Reload the list
      } catch (err: any) {
        alert(`Error rejecting product: ${err.message}`);
      }
    }
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}