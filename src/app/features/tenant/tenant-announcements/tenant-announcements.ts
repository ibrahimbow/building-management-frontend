import { Component, OnDestroy, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, finalize, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { NotificationStateService } from '../../../core/services/notification-state.service';

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
export class TenantAnnouncements implements OnInit, OnDestroy {

  private readonly announcementService = inject(AnnouncementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationState = inject(NotificationStateService);
  private readonly destroy$ = new Subject<void>();

  announcements: Announcement[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadAnnouncements();
    this.listenForAnnouncementNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenForAnnouncementNotifications(): void {
    this.notificationState.latestNotification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        if (!notification || notification.type !== 'ANNOUNCEMENT') {
          return;
        }

        this.loadAnnouncements();
      });
  }

  private loadAnnouncements(): void {
    this.isLoading = true;

    this.announcementService.getTenantAnnouncements().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: announcements => {
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
}