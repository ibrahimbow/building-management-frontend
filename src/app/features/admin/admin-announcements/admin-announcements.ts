import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { finalize, Subject, takeUntil } from 'rxjs';

import { AdminAnnouncement } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-announcements.html',
  styleUrl: './admin-announcements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAnnouncements implements OnInit, OnDestroy {

  private readonly adminService = inject(AdminService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  announcements: AdminAnnouncement[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteAnnouncement(announcementId: string): void {
    this.adminService.deleteAnnouncement(announcementId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.announcements = this.announcements.filter(
            announcement => announcement.id !== announcementId
          );

          this.notificationService.success('Announcement deleted successfully.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.notificationService.error('Could not delete announcement.');
          this.cdr.markForCheck();
        }
      });
  }

  trackByAnnouncementId(
    index: number,
    announcement: AdminAnnouncement
  ): string {
    return announcement.id;
  }

  private loadAnnouncements(): void {
    this.isLoading = true;

    this.adminService.getAnnouncements()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: announcements => {
          this.announcements = announcements;
        },
        error: () => {
          this.announcements = [];
          this.notificationService.error('Could not load announcements.');
        }
      });
  }
}