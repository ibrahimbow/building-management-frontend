import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ChangePasswordDialog } from '../../../shared/change-password-dialog/change-password-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    return `bm_user_settings_${user?.id}`;
  }
  profile = {
    name: '',
    email: '',
    mobileNumber: '',
    displayName: '',
    notifications: true,
    language: 'EN',
    avatarUrl: ''
  };

  languages = [
    { code: 'EN', label: 'English' },
    { code: 'NL', label: 'Dutch' },
    { code: 'FR', label: 'French' },
    { code: 'AR', label: 'Arabic' }
  ];

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      this.profile.name = currentUser.username;
      this.profile.email = currentUser.email;
      this.profile.displayName = currentUser.displayName;
    }

    const saved = localStorage.getItem(this.getStorageKey());

    if (saved) {
      this.profile = {
        ...this.profile,
        ...JSON.parse(saved)
      };
    }
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.profile.avatarUrl = reader.result as string;
      this.save();
    };

    reader.readAsDataURL(file);
  }

  save(): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.profile));
    console.log('Settings saved:', this.profile);
  }


  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog);

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.snackBar.open('Password updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}