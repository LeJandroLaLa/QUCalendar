import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {
  error = signal('');
  loading = signal(false);

  constructor(private authService: AuthService) {}

  async signIn(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      await this.authService.signInWithGoogle();
    } catch (err: any) {
      this.error.set(err.message || 'Sign in failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}