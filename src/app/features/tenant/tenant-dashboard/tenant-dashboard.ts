import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';
import { BuildingInfo as BuildingInfoModel } from '../../../core/models/building.model';
import { TenantBuildingStateService } from '../../../core/services/tenant-building-state.service';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss'
})
export class TenantDashboard implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly tenantBuildingState = inject(TenantBuildingStateService);

  isLeaving = false;
  errorMessage: string | null = null;

  building: BuildingInfoModel | null = null;
  hasJoinedBuilding = false;
  isLoading = true;

  readonly menuItems = [
    {
      title: 'Building Info',
      description: 'View your building details',
      icon: 'business',
      route: '/tenant/building-info',
      notificationCount: 0
    },
    {
      title: 'Announcements',
      description: 'Read updates from your building manager',
      icon: 'campaign',
      route: '/tenant/announcements',
      notificationCount: 4
    },
    {
      title: 'Chat',
      description: 'Chat with neighbors',
      icon: 'chat',
      route: '/tenant/tenant-chat',
      notificationCount: 8
    },
    {
      title: 'Help & Share',
      description: 'Share help with your building community',
      icon: 'share',
      route: '/tenant/help-share',
      notificationCount: 1
    }
  ];

  ngOnInit(): void {
    this.loadMyBuilding();
  }

  private loadMyBuilding(): void {
    this.isLoading = true;
    this.building = null;
    this.hasJoinedBuilding = false;

    this.buildingService.getMyJoinedBuilding().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: building => {
        this.building = building;
        this.hasJoinedBuilding = true;
      },
      error: () => {
        this.building = null;
        this.hasJoinedBuilding = false;
      }
    });
  }

  leaveBuilding(): void {
    if (this.isLeaving) {
      return;
    }

    this.isLeaving = true;
    this.errorMessage = null;

    this.buildingService.leaveBuilding().pipe(
      finalize(() => {
        this.isLeaving = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.building = null;
        this.hasJoinedBuilding = false;
        this.errorMessage = 'You are not connected to a building yet.';

        this.snackBar.open('You left the building successfully.', 'Close', {
          duration: 3000
        });
        this.tenantBuildingState.markLeft();
        this.router.navigate(['/tenant/dashboard']);
      },
      error: () => {
        this.snackBar.open('Could not leave the building.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}