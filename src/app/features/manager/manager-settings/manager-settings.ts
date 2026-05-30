import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  UserRole
} from '../../../core/models/user.model';

@Component({
  selector: 'app-manager-settings',
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
  templateUrl: './manager-settings.html',
  styleUrl: './manager-settings.scss'
})
export class ManagerSettings implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly imageUrlService = inject(ImageUrlService);

  isSaving = false;

  profile = {
    username: '',
    email: '',
    phoneNumber: '',
    displayName: '',
    notifications: true,
    language: 'EN',
    avatarUrl: '',
    role: '' as UserRole | ''
  };

  readonly languages = [
    { code: 'EN', label: 'English' },
    { code: 'NL', label: 'Dutch' },
    { code: 'FR', label: 'French' },
    { code: 'AR', label: 'Arabic' }
  ];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: profile => {
        this.mapProfile(profile);
        this.authService.updateCurrentUser(profile);
        this.ensureValidLanguage();
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Failed to load manager settings.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
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
      phoneNumber: this.profile.phoneNumber,
      avatarUrl: this.profile.avatarUrl || null,
      preferredLanguage: this.profile.language,
      notificationsEnabled: this.profile.notifications
    };

    this.authService.updateProfile(request).subscribe({
      next: updatedProfile => {
        this.mapProfile(updatedProfile);
        this.authService.updateCurrentUser(updatedProfile);
        this.ensureValidLanguage();

        this.isSaving = false;
        this.cdr.detectChanges();

        this.snackBar.open('Manager settings updated successfully.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();

        this.snackBar.open('Failed to update manager settings.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.snackBar.open('Password updated successfully.', 'Close', {
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

  private mapProfile(profile: BuildingUserProfile): void {
    this.profile = {
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      displayName: profile.displayName,
      notifications: profile.notificationsEnabled ?? true,
      language: profile.preferredLanguage ?? 'EN',
      avatarUrl: profile.avatarUrl ?? '',
      role: profile.role
    };
  }

  private ensureValidLanguage(): void {
    const allowedLanguages = this.languages.map(language => language.code);

    if (!this.profile.language || !allowedLanguages.includes(this.profile.language)) {
      this.profile.language = 'EN';
    }
  }
}