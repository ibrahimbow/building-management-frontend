import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './building-info.html',
  styleUrl: './building-info.scss'
})
export class BuildingInfo implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  building: BuildingInfoModel | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadMyBuilding();
  }

  private loadMyBuilding(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.building = null;

    this.buildingService.getMyJoinedBuilding().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (building) => {
        this.building = building;
      },
      error: () => {
        this.errorMessage = 'You are not connected to a building yet.';

        this.snackBar.open('Could not load building information.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}