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

import { AdminAuditEvent } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-audit.html',
  styleUrl: './admin-audit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAudit implements OnInit, OnDestroy {

  private readonly adminService = inject(AdminService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  auditEvents: AdminAuditEvent[] = [];
  isLoading = true;

  page = 0;
  size = 20;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.loadAuditEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextPage(): void {
    if (this.page + 1 >= this.totalPages) {
      return;
    }

    this.page++;
    this.loadAuditEvents();
  }

  previousPage(): void {
    if (this.page === 0) {
      return;
    }

    this.page--;
    this.loadAuditEvents();
  }

  trackByAuditEventId(
    index: number,
    auditEvent: AdminAuditEvent
  ): string {
    return auditEvent.id;
  }

  private loadAuditEvents(): void {
    this.isLoading = true;

    this.adminService.getAuditEvents(this.page, this.size)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          this.auditEvents = response.content;
          this.page = response.number;
          this.size = response.size;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        error: () => {
          this.auditEvents = [];
          this.notificationService.error('Could not load audit events.');
        }
      });
  }
}