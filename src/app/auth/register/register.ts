import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivacyPolicyDialog } from '../../shared/dialogs/privacy-policy-dialog/privacy-policy-dialog';
import { TermsOfServiceDialog } from '../../shared/dialogs/terms-of-service-dialog/terms-of-service-dialog';


@Component({
  selector: 'app-register',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {


  private readonly dialog = inject(MatDialog);

  @ViewChild('usernameInput')
  private readonly usernameInput?: ElementRef<HTMLInputElement>;

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
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar) {
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


  register(): void {
    this.errorMessage = '';

    const username = this.username.trim();
    const email = this.email.trim().toLowerCase();
    const displayName = this.displayName.trim();
    const phoneNumber = this.phoneNumber.trim();

    if (!username || !email || !displayName || !phoneNumber || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters.';
      return;
    }

    if (displayName.length < 2) {
      this.errorMessage = 'Display name must be at least 2 characters.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!/^\+?[0-9]{8,15}$/.test(phoneNumber)) {
      this.errorMessage = 'Phone number must contain 8 to 15 digits.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;

    this.authService.register({
      username,
      email,
      password: this.password,
      displayName,
      phoneNumber,
      role: this.role
    }).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.authService.login({
          usernameOrEmail: email,
          password: this.password
        }).pipe(
          switchMap(() => this.authService.loadCurrentUser())
        ).subscribe({
          next: () => {
            this.router.navigateByUrl(this.authService.getDashboardUrl());
          },
          error: () => {
            this.errorMessage = 'Account created, but login failed. Please login manually.';
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.errorMessage = 'This email or username is already used. Please use another one.';
        } else if (err.status === 400) {
          this.errorMessage = 'Please check your registration details.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }

        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}