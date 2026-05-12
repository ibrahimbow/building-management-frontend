import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';


@Component({
  selector: 'app-manager-announcements',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TimeAgoPipe
  ],
  templateUrl: './manager-announcements.html',
  styleUrl: './manager-announcements.scss'
})
export class ManagerAnnouncements implements OnInit {

  private readonly announcementService = inject(AnnouncementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  
  announcements: Announcement[] = [];
  isLoading = true;
  isDeleting = false;

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading = true;

    this.announcementService.getManagerAnnouncements().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (announcements) => {
        console.log('Loaded announcements:', announcements);

        this.announcements = [...announcements].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.cdr.detectChanges();
      },
      error: () => {
        this.announcements = [];

        this.snackBar.open('Could not load announcements.', 'Close', {
          duration: 3000
        });

        this.cdr.detectChanges();
      }
    });
  }

  deleteAnnouncement(id: string): void {
    this.isDeleting = true;

    this.announcementService.deleteAnnouncement(id).pipe(
      finalize(() => {
        this.isDeleting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.announcements = this.announcements.filter(
          announcement => announcement.id !== id
        );

        this.snackBar.open('Announcement deleted.', 'Close', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Could not delete announcement.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  hasValidImage(imageUrl: string | null | undefined): boolean {
    return !!imageUrl && imageUrl.startsWith('http');
  }
}