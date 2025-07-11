import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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

  onSubmit() {
    console.log('Product to upload:', this.product);
    // Here you would typically upload the product to Firebase
    // Example Firebase integration point:
    // this.firebaseService.addProduct(this.product)
    alert('Product uploaded successfully! (Demo)');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}