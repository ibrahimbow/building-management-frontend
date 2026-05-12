import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { finalize, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  login(): void {

    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Username/email and password are required.';
      return;
    }

    this.isSubmitting = true;

    this.authService.login({
      usernameOrEmail: this.email.trim(),
      password: this.password
    }).pipe(
      switchMap(() => this.authService.loadCurrentUser()),
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl(
          this.authService.getDashboardUrl()
        );
      },
      error: (err) => {
        this.errorMessage = err.status === 401
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.';
      }
    });
  }
}