import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialog>,
    private authService: AuthService
  ) {}

  save(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'No user is logged in.';
      return;
    }

    // if (this.currentPassword !== currentUser.password) {
    //   this.errorMessage = 'Current password is incorrect.';
    //   return;
    // }

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    // this.authService.updatePassword(this.newPassword);
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}