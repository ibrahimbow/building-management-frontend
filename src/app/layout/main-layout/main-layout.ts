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