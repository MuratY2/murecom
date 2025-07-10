import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserData } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userData: UserData | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Subscribe to user data changes
    this.authService.userData$.subscribe(data => {
      this.userData = data;
      this.isLoading = false;
    });
  }

  get userTypeDisplay(): string {
    switch (this.userData?.userType) {
      case 'buyer': return 'Buyer';
      case 'seller': return 'Seller';
      case 'admin': return 'Administrator';
      default: return 'Buyer';
    }
  }

  get userTypeBadgeClass(): string {
    switch (this.userData?.userType) {
      case 'buyer': return 'badge-buyer';
      case 'seller': return 'badge-seller';
      case 'admin': return 'badge-admin';
      default: return 'badge-buyer';
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}