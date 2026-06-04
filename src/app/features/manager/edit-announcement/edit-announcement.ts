import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  AnnouncementCategory,
  UpdateAnnouncementRequest
} from '../../../core/models/announcement.model';

import { AnnouncementService } from '../../../core/services/announcement.service';

@Component({
  selector: 'app-edit-announcement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-announcement.html',
  styleUrl: './edit-announcement.scss'
})
export class EditAnnouncement implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly announcementService = inject(AnnouncementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  announcementId = '';

  title = '';
  message = '';
  category: AnnouncementCategory = 'GENERAL';
  imageUrl = '';

  isLoading = true;
  isSubmitting = false;
  isUploading = false;

  readonly categories: AnnouncementCategory[] = [
    'GENERAL',
    'MAINTENANCE',
    'EMERGENCY',
    'EVENT',
    'REMINDER',
    'SAFETY'
  ];

  ngOnInit(): void {
    this.announcementId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.announcementId) {
      this.isLoading = false;

      this.snackBar.open('Announcement id is missing.', 'Close', {
        duration: 3000
      });

      this.router.navigateByUrl('/manager/announcements');
      return;
    }

    this.loadAnnouncement();
  }

  private loadAnnouncement(): void {
    this.isLoading = true;

    this.announcementService.getAnnouncementById(this.announcementId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: announcement => {
        this.title = announcement.title;
        this.message = announcement.message;
        this.category = announcement.category;
        this.imageUrl = announcement.imageUrl ?? '';
      },
      error: () => {
        this.snackBar.open('Could not load announcement.', 'Close', {
          duration: 3000
        });

        this.router.navigateByUrl('/manager/announcements');
      }
    });
  }

  updateAnnouncement(form: NgForm): void {
    if (form.invalid || this.isSubmitting || this.isUploading) {
      form.form.markAllAsTouched();

      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000
      });

      return;
    }

    const request: UpdateAnnouncementRequest = {
      title: this.title.trim(),
      message: this.message.trim(),
      category: this.category,
      imageUrl: this.normalizeImageUrl(this.imageUrl)
    };

    this.isSubmitting = true;

    this.announcementService.updateAnnouncement(this.announcementId, request).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Announcement updated successfully.', 'Close', {
          duration: 2500
        });

        this.router.navigateByUrl('/manager/announcements');
      },
      error: () => {
        this.snackBar.open('Could not update announcement.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please select a valid image file.', 'Close', {
        duration: 3000
      });
      input.value = '';
      return;
    }

    const maxFileSizeInMb = 5;
    const maxFileSizeInBytes = maxFileSizeInMb * 1024 * 1024;

    if (file.size > maxFileSizeInBytes) {
      this.snackBar.open(`Image must be smaller than ${maxFileSizeInMb}MB.`, 'Close', {
        duration: 3000
      });
      input.value = '';
      return;
    }

    this.isUploading = true;

    this.announcementService.uploadAnnouncementImage(file).pipe(
      finalize(() => {
        this.isUploading = false;
        this.cdr.markForCheck();
        input.value = '';
      })
    ).subscribe({
      next: response => {
        this.imageUrl = response.url;

        this.snackBar.open('Image uploaded successfully.', 'Close', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Could not upload image. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  removeImage(): void {
    this.imageUrl = '';
  }

  hasValidImage(imageUrl: string | null | undefined): boolean {
    return !!imageUrl && imageUrl.trim().length > 0;
  }

  resolveImageUrl(imageUrl: string | null | undefined): string {

    if (!imageUrl) {
      return '';
    }

    const normalizedUrl = imageUrl
      .replace('/profile_avatar/', '/PROFILE_AVATAR/')
      .replace('/announcement_image/', '/ANNOUNCEMENT_IMAGE/')
      .replace('/share_and_help_image/', '/SHARE_AND_HELP_IMAGE/')
      .replace('/chat_message_image/', '/CHAT_MESSAGE_IMAGE/');

    if (
      normalizedUrl.startsWith('http') ||
      normalizedUrl.startsWith('data:image')
    ) {
      return normalizedUrl;
    }

    if (normalizedUrl.startsWith('/')) {
      return normalizedUrl;
    }

    return `/${normalizedUrl}`;
  }

  private normalizeImageUrl(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    return trimmed;
  }
} 