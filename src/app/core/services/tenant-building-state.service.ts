import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BuildingService } from './building.service';

@Injectable({
  providedIn: 'root'
})
export class TenantBuildingStateService {

  private readonly buildingService = inject(BuildingService);

  private readonly tenantHasJoinedBuildingSubject =
    new BehaviorSubject<boolean>(false);

  readonly tenantHasJoinedBuilding$ =
    this.tenantHasJoinedBuildingSubject.asObservable();

  refresh(): void {
    this.buildingService.getMyJoinedBuilding().subscribe({
      next: () => this.tenantHasJoinedBuildingSubject.next(true),
      error: () => this.tenantHasJoinedBuildingSubject.next(false)
    });
  }

  markJoined(): void {
    this.tenantHasJoinedBuildingSubject.next(true);
  }

  markLeft(): void {
    this.tenantHasJoinedBuildingSubject.next(false);
  }
}