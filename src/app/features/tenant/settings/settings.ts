import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { ImageUrlService } from '../../../core/services/image-url.service';
import { ChangePasswordDialog } from '../../../shared/change-password-dialog/change-password-dialog';

import {
  BuildingUserProfile,
  UpdateBuildingUserProfileRequest,
  UserRole,
  User
} from '../../../core/models/user.model';

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

  isSaving = false;

  profile = {
    name: '',
    email: '',
    mobileNumber: '',
    displayName: '',
    notifications: true,
    language: 'EN',
    avatarUrl: '',
    role: '' as UserRole | ''
  };

  languages = [
    { code: 'EN', label: 'English' },
    { code: 'NL', label: 'Dutch' },
    { code: 'FR', label: 'French' },
    { code: 'AR', label: 'Arabic' }
  ];

  constructor(
    public authService: AuthService,
    public imageUrlService: ImageUrlService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private readonly fileUploadService: FileUploadService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (updatedProfile: BuildingUserProfile) => {

        this.profile = {
          name: updatedProfile.username,
          email: updatedProfile.email,
          mobileNumber: updatedProfile.phoneNumber,
          displayName: updatedProfile.displayName,
          notifications: updatedProfile.notificationsEnabled ?? true,
          language: updatedProfile.preferredLanguage ?? 'EN',
          avatarUrl: updatedProfile.avatarUrl ?? '',
          role: updatedProfile.role
        };

        this.authService.updateCurrentUser(updatedProfile);

        this.ensureValidLanguage();

        this.isSaving = false;

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('FAILED TO LOAD PROFILE:', error);

        this.snackBar.open('Failed to load profile settings.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  private ensureValidLanguage(): void {
    const allowedLanguageCodes = this.languages.map(language => language.code);

    if (!this.profile.language || !allowedLanguageCodes.includes(this.profile.language)) {
      this.profile.language = 'EN';
    }
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    this.fileUploadService.upload(file, 'PROFILE_AVATAR').subscribe({
      next: response => {
        this.profile.avatarUrl = response.url;
        this.cdr.detectChanges();
        this.save();
      },
      error: () => {
        this.snackBar.open('Failed to upload profile photo.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  save(): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const request: UpdateBuildingUserProfileRequest = {
      displayName: this.profile.displayName,
      phoneNumber: this.profile.mobileNumber,
      avatarUrl: this.profile.avatarUrl || null,
      preferredLanguage: this.profile.language,
      notificationsEnabled: this.profile.notifications
    };

    this.authService.updateProfile(request).subscribe({
      next: (updatedProfile: BuildingUserProfile) => {
        this.profile = {
          name: updatedProfile.username,
          email: updatedProfile.email,
          mobileNumber: updatedProfile.phoneNumber,
          displayName: updatedProfile.displayName,
          notifications: updatedProfile.notificationsEnabled ?? true,
          language: updatedProfile.preferredLanguage ?? 'EN',
          avatarUrl: updatedProfile.avatarUrl ?? '',
          role: updatedProfile.role
        };

        this.authService.updateCurrentUser(updatedProfile);

        this.ensureValidLanguage();
        this.isSaving = false;
        this.cdr.detectChanges();

        this.snackBar.open('Settings updated successfully.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();

        this.snackBar.open('Failed to update settings.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog);

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.snackBar.open('Password updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        window.location.reload();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}