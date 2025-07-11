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
    images: [] as string[],
    specifications: {
      weight: '',
      dimensions: '',
      material: '',
      color: ''
    },
    tags: [] as string[]
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

  selectedFiles: File[] = [];
  dragOver = false;
  currentTag = '';

  constructor(private router: Router) {}

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  addTag() {
    if (this.currentTag.trim() && !this.product.tags.includes(this.currentTag.trim())) {
      this.product.tags.push(this.currentTag.trim());
      this.currentTag = '';
    }
  }

  removeTag(index: number) {
    this.product.tags.splice(index, 1);
  }

  onSubmit() {
    console.log('Product to upload:', this.product);
    console.log('Selected files:', this.selectedFiles);
    // Here you would typically upload the product to your backend
    alert('Product uploaded successfully! (Demo)');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}