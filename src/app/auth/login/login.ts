import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Username/email and password are required.';
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.authService.loadCurrentUser().subscribe({
          next: () => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
            this.router.navigateByUrl(this.authService.getDashboardUrl());
          },
          error: () => {
            this.isSubmitting = false;
            this.errorMessage = 'Login failed. Please try again.';
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.log('CAUGHT ERROR:', err);
        this.isSubmitting = false;
        this.errorMessage =
          err.status === 401
            ? 'Invalid email or password.'
            : 'Login failed. Please try again.';
        this.cdr.detectChanges(); // ← forces view to update
      }
    });
  }
}