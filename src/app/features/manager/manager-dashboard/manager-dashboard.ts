import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BuildingService } from '../../../core/services/building.service';
import { BuildingInfo } from '../../../core/models/building.model';

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
  private readonly cdr = inject(ChangeDetectorRef);

  building: BuildingInfo | null = null;
  hasBuilding = false;
  isReady = false;

  ngOnInit(): void {
    this.loadMyBuilding();
  }

  private loadMyBuilding(): void {
    this.buildingService.getMyManagedBuilding().subscribe({
      next: (building) => {
        this.building = building;
        this.hasBuilding = !!building;
        this.isReady = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.building = null;
        this.hasBuilding = false;
        this.isReady = true;
        this.cdr.markForCheck();
      }
    });
  }
}