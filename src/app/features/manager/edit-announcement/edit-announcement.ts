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
      next: (announcement) => {
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
    if (form.invalid || this.isSubmitting) {
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

  private normalizeImageUrl(value: string): string | null {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
}