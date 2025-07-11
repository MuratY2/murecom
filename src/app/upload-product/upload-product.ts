import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service'; // Import the new service

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-product.html',
  styleUrls: ['./upload-product.css']
})
export class UploadProductComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    imageUrl: ''
  };

  categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Health & Beauty',
    'Automotive'
  ];

  showImagePreview = false;
  imagePreviewError = false;
  uploading = false; // New state for loading indicator
  uploadSuccess = false;
  uploadError: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService // Inject the ProductService
  ) {}

  previewImage() {
    if (this.product.imageUrl.trim()) {
      this.showImagePreview = true;
      this.imagePreviewError = false;
    }
  }

  onImageError() {
    this.imagePreviewError = true;
  }

  onImageLoad() {
    this.imagePreviewError = false;
  }

  closePreview() {
    this.showImagePreview = false;
    this.imagePreviewError = false;
  }

  async onSubmit() {
    this.uploading = true;
    this.uploadSuccess = false;
    this.uploadError = null;

    try {
      await this.productService.addProduct(this.product);
      this.uploadSuccess = true;
      // Optionally reset form or navigate
      this.resetForm();
      alert('Product uploaded successfully!'); // Keep alert for immediate feedback
    } catch (error: any) {
      this.uploadError = error.message || 'An unknown error occurred during upload.';
      alert(`Upload failed: ${this.uploadError}`); // Keep alert for immediate feedback
    } finally {
      this.uploading = false;
    }
  }

  resetForm() {
    this.product = {
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      stock: 0,
      imageUrl: ''
    };
    // Reset form validation state if using template-driven forms
    // For reactive forms, you'd use form.reset()
  }

  goBack() {
    this.router.navigate(['/']);
  }
}