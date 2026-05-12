import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, finalize, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';
import { BuildingTenant } from '../../../core/models/building-tenant.model';
import { BuildingInfo } from '../../../core/models/building.model';

@Component({
  selector: 'app-building-tenants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './building-tenants.html',
  styleUrl: './building-tenants.scss'
})
export class BuildingTenants implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);

  building: BuildingInfo | null = null;
  tenants: BuildingTenant[] = [];

  isLoading = true;
  removingTenantUserId: number | null = null;

  ngOnInit(): void {
    this.loadTenants();
  }

  removeTenant(tenantUserId: number): void {
    if (!this.building || this.removingTenantUserId !== null) {
      return;
    }

    this.removingTenantUserId = tenantUserId;

    this.buildingService.removeTenantFromBuilding(
      this.building.id,
      tenantUserId
    ).pipe(
      finalize(() => {
        this.removingTenantUserId = null;
      })
    ).subscribe({
      next: () => {
        this.tenants = this.tenants.filter(
          tenant => tenant.tenantUserId !== tenantUserId
        );

        this.snackBar.open('Tenant removed successfully.', 'Close', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Could not remove tenant.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private loadTenants(): void {
    this.isLoading = true;

    this.buildingService.getMyManagedBuilding().pipe(
      switchMap((building) => {
        if (!building) {
          this.building = null;
          this.tenants = [];
          return EMPTY;
        }

        this.building = building;
        return this.buildingService.getBuildingTenants(building.id);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: () => {
        this.building = null;
        this.tenants = [];

        this.snackBar.open('Could not load tenants.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}