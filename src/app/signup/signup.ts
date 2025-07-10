import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  displayName = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.displayName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signUp(this.email, this.password, this.displayName);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}