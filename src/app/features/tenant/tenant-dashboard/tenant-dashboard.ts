import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { BuildingService } from '../../../core/services/building.service';

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
    MatDividerModule
  ],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss'
})
export class TenantDashboard implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly cdr = inject(ChangeDetectorRef);

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
      description: 'Chat with manager or neighbors',
      icon: 'chat',
      route: '/tenant/resident-chat',
      notificationCount: 8
    },
    {
      title: 'Help & Share',
      description: 'Invite others or get help',
      icon: 'share',
      route: '/tenant/help-share',
      notificationCount: 1
    }
  ];

  ngOnInit(): void {
    this.loadTenantBuildingState();
  }

  private loadTenantBuildingState(): void {
    this.buildingService.getMyJoinedBuilding().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.hasJoinedBuilding = true;
      },
      error: () => {
        this.hasJoinedBuilding = false;
      }
    });
  }
}