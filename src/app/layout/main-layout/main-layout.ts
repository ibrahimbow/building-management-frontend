import { Component, ChangeDetectorRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { Observable, Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { BuildingService } from '../../core/services/building.service';
import { ImageUrlService } from '../../core/services/image-url.service';
import { NotificationStateService } from '../../core/services/notification-state.service';
import { TenantBuildingStateService } from '../../core/services/tenant-building-state.service';
import { NotificationItem } from '../../core/services/notification.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  requiresBuilding?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit, OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly buildingService = inject(BuildingService);
  private readonly tenantBuildingState = inject(TenantBuildingStateService);
  private readonly notificationState = inject(NotificationStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly imageUrlService = inject(ImageUrlService);

  readonly notifications$: Observable<NotificationItem[]> = this.notificationState.notifications$;
  readonly currentUser$ = this.authService.currentUser$;
  readonly unreadCount$ = this.notificationState.unreadCount$;

  managerHasBuilding = false;
  tenantHasJoinedBuilding = false;

  readonly managerMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/manager/dashboard' },
    { label: 'Building Tenants', icon: 'groups', route: '/manager/building-tenants', requiresBuilding: true },
    { label: 'Announcements', icon: 'campaign', route: '/manager/announcements', requiresBuilding: true },
    { label: 'Building Chat', icon: 'chat', route: '/manager/building-chat', requiresBuilding: true },
    { label: 'Share & Help', icon: 'volunteer_activism', route: '/manager/help-share', requiresBuilding: true },
    { label: 'Settings', icon: 'settings', route: '/manager/settings' }
  ];

  readonly tenantMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/tenant/dashboard' },
    { label: 'Join Building', icon: 'apartment', route: '/tenant/join-building' },
    { label: 'Building Info', icon: 'business', route: '/tenant/building-info', requiresBuilding: true },
    { label: 'Announcements', icon: 'campaign', route: '/tenant/announcements', requiresBuilding: true },
    { label: 'Share & Help', icon: 'volunteer_activism', route: '/tenant/help-share', requiresBuilding: true },
    { label: 'Building Chat', icon: 'chat', route: '/tenant/building-chat', requiresBuilding: true },
    { label: 'Settings', icon: 'settings', route: '/tenant/settings' }
  ];

  ngOnInit(): void {
    this.initializeNotifications();

    if (this.isManagerOrAdmin) {
      this.loadManagerBuildingState();
    }

    if (this.isTenant) {
      this.loadTenantBuildingState();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isManagerOrAdmin(): boolean {
    return this.authService.isManagerOrAdmin();
  }

  get isTenant(): boolean {
    return this.authService.isTenant();
  }

  get isChatPage(): boolean {
    return this.router.url.includes('/chat');
  }

  canShowManagerMenuItem(item: MenuItem): boolean {
    return !item.requiresBuilding || this.managerHasBuilding;
  }

  canShowTenantMenuItem(item: MenuItem): boolean {
    return !item.requiresBuilding || this.tenantHasJoinedBuilding;
  }

  openNotification(notification: NotificationItem): void {
    if (!notification.read) {
      this.notificationState.markAsRead(notification.id);
    }

    if (notification.type === 'ANNOUNCEMENT') {
      this.router.navigate(['/tenant/announcements']);
      return;
    }

    if (notification.type === 'CHAT') {
      this.router.navigate(['/tenant/building-chat']);
      return;
    }

    if (notification.type === 'SHARE_AND_HELP') {
      this.router.navigate(['/tenant/help-share']);
    }
  }

  logout(): void {
    this.notificationState.reset();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private initializeNotifications(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentUser => {
        if (!currentUser?.id) {
          return;
        }

        this.notificationState.initialize(currentUser.id);
      });
  }

  private loadManagerBuildingState(): void {
    this.buildingService.getMyManagedBuilding()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: building => {
          this.managerHasBuilding = building !== null;
          this.cdr.markForCheck();
        },
        error: () => {
          this.managerHasBuilding = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadTenantBuildingState(): void {
    this.tenantBuildingState.tenantHasJoinedBuilding$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.tenantHasJoinedBuilding = value;
        this.cdr.markForCheck();
      });

    this.tenantBuildingState.refresh();
  }
}