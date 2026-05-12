import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register {

  username = '';
  email = '';
  password = '';
  displayName = '';
  phoneNumber = '';
  role: UserRole = 'TENANT';

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  register(): void {
    this.errorMessage = '';

    if (!this.username || !this.email || !this.displayName || !this.phoneNumber || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;

    this.authService.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      displayName: this.displayName.trim(),
      phoneNumber: this.phoneNumber.trim(),
      role: this.role
    }).pipe(
      switchMap(() => this.authService.login({
        usernameOrEmail: this.email.trim(),
        password: this.password
      })),
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
      }
    });
  }
}