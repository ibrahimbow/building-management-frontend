import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BuildingService } from '../../../core/services/building.service';
import { BuildingInfo as BuildingInfoModel } from '../../../core/models/building.model';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './building-info.html',
  styleUrl: './building-info.scss'
})
export class BuildingInfo implements OnInit {

  private readonly buildingService = inject(BuildingService);

  building: BuildingInfoModel | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadMyBuilding();
  }

  private loadMyBuilding(): void {
    this.buildingService.getMyJoinedBuilding().subscribe({
      next: (building) => {
        this.building = building;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'You are not connected to a building yet.';
        this.isLoading = false;
      }
    });
  }
}