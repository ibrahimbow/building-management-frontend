import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { finalize, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { DemoNotice } from '../../shared/components/demo-notice/demo-notice';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivacyPolicyDialog } from '../../shared/dialogs/privacy-policy-dialog/privacy-policy-dialog';
import { TermsOfServiceDialog } from '../../shared/dialogs/terms-of-service-dialog/terms-of-service-dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DemoNotice

  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';

  errorMessage = '';
  isSubmitting = false;

  private readonly dialog = inject(MatDialog);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  openPrivacyPolicy(): void {
    console.log('Privacy clicked');

    this.dialog.open(PrivacyPolicyDialog, {
      width: '760px',
      maxWidth: '92vw',
      autoFocus: false,
      restoreFocus: false
    });
  }
  
  openTermsOfService(): void {
    this.dialog.open(TermsOfServiceDialog, {
      width: '760px',
      maxWidth: '92vw',
      autoFocus: false,
      restoreFocus: false
    });
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
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl(
          this.authService.getDashboardUrl(),
          { replaceUrl: true }
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