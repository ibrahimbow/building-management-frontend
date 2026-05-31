import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BuildingService } from '../../../core/services/building.service';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { ChatService } from '../../../core/services/chat.service';

import { BuildingTenant } from '../../../core/models/building-tenant.model';
import { Building } from '../../../core/models/building.model';
import { Announcement } from '../../../core/models/announcement.model';
import { ChatMessage } from '../../../core/models/chat-message.model';

interface ActivityPoint {
  label: string;
  count: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss'
})
export class ManagerDashboard implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly chatService = inject(ChatService);
  private readonly cdr = inject(ChangeDetectorRef);

  building: Building | null = null;
  tenants: BuildingTenant[] = [];
  recentAnnouncements: Announcement[] = [];

  hasBuilding = false;
  isReady = false;

  totalTenants = 0;
  totalAnnouncements = 0;
  totalMessages = 0;

  activityYAxisLabels = [40, 30, 20, 10, 0];
  activityXAxisLabels: string[] = [];

  activityPoints: ActivityPoint[] = [];
  visibleActivityPoints: ActivityPoint[] = [];

  activityPath = '';
  activityAreaPath = '';

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.buildingService.getMyManagedBuilding().pipe(
      catchError(() => of(null)),
      switchMap((building) => {
        this.building = building;
        this.hasBuilding = !!building;

        if (!building) {
          return of({
            tenants: [] as BuildingTenant[],
            announcements: [] as Announcement[],
            messages: [] as ChatMessage[]
          });
        }

        return forkJoin({
          tenants: this.buildingService.getBuildingTenants(building.id).pipe(
            catchError(() => of([] as BuildingTenant[]))
          ),
          announcements: this.announcementService.getManagerAnnouncements().pipe(
            catchError(() => of([] as Announcement[]))
          ),
          messages: this.chatService.getMessages().pipe(
            catchError(() => of([] as ChatMessage[]))
          )
        });
      })
    ).subscribe({
      next: ({ tenants, announcements, messages }) => {
        const activeMessages = messages.filter(message => !message.deleted);

        this.tenants = tenants;
        this.totalTenants = tenants.length;
        this.totalAnnouncements = announcements.length;
        this.totalMessages = activeMessages.length;

        this.recentAnnouncements = announcements
          .slice()
          .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        this.buildActivityOverview(announcements, activeMessages, tenants);

        this.isReady = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.resetDashboard();
        this.isReady = true;
        this.cdr.markForCheck();
      }
    });
  }

  private buildActivityOverview(
    announcements: Announcement[],
    messages: ChatMessage[],
    tenants: BuildingTenant[]
  ): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = today.toLocaleString('en-US', { month: 'short' });

    const dailyCounts = Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      count: 0
    }));

    announcements.forEach(announcement =>
      this.addToDailyCount(dailyCounts, announcement.createdAt, year, month)
    );

    messages.forEach(message =>
      this.addToDailyCount(dailyCounts, message.createdAt, year, month)
    );

    tenants.forEach(tenant => {
      const joinedAt = (tenant as BuildingTenant & { joinedAt?: string }).joinedAt;

      if (joinedAt) {
        this.addToDailyCount(dailyCounts, joinedAt, year, month);
      }
    });

    const visualCounts = this.buildVisualActivityCounts(dailyCounts.map(item => item.count));
    const maxVisualCount = Math.max(...visualCounts, 1);
    const visualMax = Math.max(40, Math.ceil(maxVisualCount / 10) * 10);

    this.activityYAxisLabels = [
      visualMax,
      Math.round(visualMax * 0.75),
      Math.round(visualMax * 0.5),
      Math.round(visualMax * 0.25),
      0
    ];

    this.activityPoints = dailyCounts.map((item, index) => {
      const x = daysInMonth === 1 ? 0 : (index / (daysInMonth - 1)) * 100;
      const y = 92 - (visualCounts[index] / visualMax) * 74;

      return {
        label: `${monthName} ${item.day}`,
        count: item.count,
        x,
        y
      };
    });

    this.activityPath = this.buildSmoothPath(this.activityPoints);
    this.activityAreaPath = `${this.activityPath} L 100 100 L 0 100 Z`;

    this.visibleActivityPoints = this.activityPoints.filter(point => point.count > 0);

    this.activityXAxisLabels = [
      `${monthName} 1`,
      `${monthName} ${Math.round(daysInMonth / 2)}`,
      `${monthName} ${daysInMonth}`
    ];
  }

  private buildVisualActivityCounts(rawCounts: number[]): number[] {
    const hasRealActivity = rawCounts.some(count => count > 0);

    if (!hasRealActivity) {
      return rawCounts.map(() => 0);
    }

    const totalActivity = rawCounts.reduce((sum, count) => sum + count, 0);
    const averageActivity = totalActivity / rawCounts.length;
    const baseline = Math.max(averageActivity * 0.65, 4);

    return rawCounts.map((count, index) => {
      const previous = rawCounts[index - 1] ?? count;
      const next = rawCounts[index + 1] ?? count;

      const smoothed = (previous + count + next) / 3;

      if (count === 0 && smoothed === 0) {
        return baseline;
      }

      return Math.max(smoothed + baseline, baseline);
    });
  }

  private buildSmoothPath(points: ActivityPoint[]): string {
    if (points.length === 0) {
      return '';
    }

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 0; index < points.length - 1; index++) {
      const current = points[index];
      const next = points[index + 1];

      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;

      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    return path;
  }

  private addToDailyCount(
    dailyCounts: { day: number; count: number }[],
    dateValue: string,
    year: number,
    month: number
  ): void {
    const date = new Date(dateValue);

    if (date.getFullYear() !== year || date.getMonth() !== month) {
      return;
    }

    const dayIndex = date.getDate() - 1;

    if (dailyCounts[dayIndex]) {
      dailyCounts[dayIndex].count++;
    }
  }

  private resetDashboard(): void {
    this.building = null;
    this.tenants = [];
    this.recentAnnouncements = [];
    this.hasBuilding = false;

    this.totalTenants = 0;
    this.totalAnnouncements = 0;
    this.totalMessages = 0;

    this.activityPoints = [];
    this.visibleActivityPoints = [];
    this.activityPath = '';
    this.activityAreaPath = '';
  }
}