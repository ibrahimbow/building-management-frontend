import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss'
})
export class ChangePasswordDialog {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  errorMessage = '';
  isSaving = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ChangePasswordDialog>,
    private readonly authService: AuthService
  ) {}

  save(): void {
    this.errorMessage = '';

    if (!this.currentPassword.trim()) {
      this.errorMessage = 'Current password is required.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage = 'New password must be at least 8 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.errorMessage = 'New password must be different from current password.';
      return;
    }

    this.isSaving = true;

    this.authService.changePassword(
      {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      }
    )
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            'Password could not be changed. Please check your current password.';
        }
      });
  }

  cancel(): void {
    if (this.isSaving) {
      return;
    }

    this.dialogRef.close(false);
  }
}