import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement.service';

@Component({
  selector: 'app-tenant-announcements',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './tenant-announcements.html',
  styleUrl: './tenant-announcements.scss'
})
export class TenantAnnouncements implements OnInit {

  private readonly announcementService = inject(AnnouncementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  announcements: Announcement[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {
    this.isLoading = true;

    this.announcementService.getTenantAnnouncements().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (announcements) => {
        this.announcements = announcements;
      },
      error: () => {
        this.announcements = [];

        this.snackBar.open('Could not load announcements.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  hasValidImage(imageUrl: string | null | undefined): boolean {
    return !!imageUrl && imageUrl.startsWith('http');
  }
}