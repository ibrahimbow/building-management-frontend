import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  email = '';
  password = '';
  nickname = '';
  role: UserRole = 'TENANT';

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
     console.log('REGISTER CLICKED');
    this.errorMessage = '';

    if (!this.name || !this.email || !this.nickname || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;
console.log('CALLING API');
    this.authService.register({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      nickname: this.nickname.trim(),
      role: this.role,
    }).pipe(
      switchMap(() => this.authService.login(this.email.trim(), this.password)),
      switchMap(() => this.authService.loadCurrentUser())
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl(this.authService.getDashboardUrl());
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 409) {
          this.errorMessage = 'An account already exists with this email or username.';
          return;
        }

        if (err.status === 400) {
          this.errorMessage = 'Please check your registration details.';
          return;
        }

        this.errorMessage = 'Registration failed. Please try again.';
      },
    });
  }
}