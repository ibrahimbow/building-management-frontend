import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../core/services/auth.service';
import { BuildingService } from '../../core/services/building.service';

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
    MatButtonModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly buildingService = inject(BuildingService);
  private readonly cdr = inject(ChangeDetectorRef);

  managerHasBuilding = false;
  tenantHasJoinedBuilding = false;

  readonly managerMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/manager/dashboard'
    },
    {
      label: 'Building Tenants',
      icon: 'groups',
      route: '/manager/building-tenants',
      requiresBuilding: true
    },
    {
      label: 'Announcements',
      icon: 'campaign',
      route: '/manager/announcements',
      requiresBuilding: true
    }
  ];

  readonly tenantMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/tenant/dashboard'
    },
    {
      label: 'Join Building',
      icon: 'apartment',
      route: '/tenant/join-building'
    },
    {
      label: 'Building Info',
      icon: 'business',
      route: '/tenant/building-info',
      requiresBuilding: true
    },
    {
      label: 'Announcements',
      icon: 'campaign',
      route: '/tenant/announcements',
      requiresBuilding: true
    },
    {
      label: 'Help & Share',
      icon: 'volunteer_activism',
      route: '/tenant/help-share',
      requiresBuilding: true
    },
    {
      label: 'Resident Chat',
      icon: 'chat',
      route: '/tenant/resident-chat',
      requiresBuilding: true
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/tenant/settings'
    }
  ];

  ngOnInit(): void {
    if (this.isManagerOrAdmin) {
      this.loadManagerBuildingState();
    }

    if (this.isTenant) {
      this.loadTenantBuildingState();
    }
  }

  get isManagerOrAdmin(): boolean {
    return this.authService.isManagerOrAdmin();
  }

  get isTenant(): boolean {
    return this.authService.isTenant();
  }

  get displayName(): string {
    return this.authService.getCurrentUser()?.displayName ?? 'User';
  }

  canShowManagerMenuItem(item: MenuItem): boolean {
    return !item.requiresBuilding || this.managerHasBuilding;
  }

  canShowTenantMenuItem(item: MenuItem): boolean {
    return !item.requiresBuilding || this.tenantHasJoinedBuilding;
  }

  logout(): void {
    this.authService.logout();
  }

  private loadManagerBuildingState(): void {
    this.buildingService.getMyManagedBuilding().subscribe({
      next: (building) => {
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
    this.buildingService.getMyJoinedBuilding().subscribe({
      next: () => {
        this.tenantHasJoinedBuilding = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.tenantHasJoinedBuilding = false;
        this.cdr.markForCheck();
      }
    });
  }
}