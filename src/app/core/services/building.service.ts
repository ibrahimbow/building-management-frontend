import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  BuildingInfo,
  CreateBuildingRequest,
  UpdateBuildingRequest
} from '../models/building.model';

import { BuildingTenant } from '../models/building-tenant.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private readonly http = inject(HttpClient);

  private readonly managerBuildingsUrl = 'http://localhost:8080/api/manager/buildings';
  private readonly tenantBuildingsUrl = 'http://localhost:8080/api/tenant/buildings';

  createBuilding(request: CreateBuildingRequest): Observable<BuildingInfo> {
    return this.http.post<BuildingInfo>(
      this.managerBuildingsUrl,
      request
    );
  }

  getMyManagedBuildings(): Observable<BuildingInfo[]> {
    return this.http.get<BuildingInfo[]>(
      this.managerBuildingsUrl
    );
  }

  getMyManagedBuilding(): Observable<BuildingInfo | null> {
    return this.http.get<BuildingInfo[]>(this.managerBuildingsUrl).pipe(
      map((buildings) => {
        if (!Array.isArray(buildings) || buildings.length === 0) {
          return null;
        }

        return buildings[0];
      })
    );
  }
  getMyBuildingById(id: string): Observable<BuildingInfo> {
    return this.http.get<BuildingInfo>(
      `${this.managerBuildingsUrl}/${id}`
    );
  }

  updateMyBuilding(
    id: string,
    request: UpdateBuildingRequest
  ): Observable<BuildingInfo> {
    return this.http.put<BuildingInfo>(
      `${this.managerBuildingsUrl}/${id}`,
      request
    );
  }

  deleteMyBuilding(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.managerBuildingsUrl}/${id}`
    );
  }

  getBuildingTenants(buildingId: string): Observable<BuildingTenant[]> {
    return this.http.get<BuildingTenant[]>(
      `${this.managerBuildingsUrl}/${buildingId}/tenants`
    );
  }

  removeTenantFromBuilding(
    buildingId: string,
    tenantUserId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.managerBuildingsUrl}/${buildingId}/tenants/${tenantUserId}`
    );
  }

  getMyJoinedBuilding(): Observable<BuildingInfo> {
    return this.http.get<BuildingInfo>(
      `${this.tenantBuildingsUrl}/my-building`
    );
  }

  joinBuilding(code: string): Observable<BuildingInfo> {
    return this.http.post<BuildingInfo>(
      `${this.tenantBuildingsUrl}/join`,
      { code }
    );
  }

  getBuildingByCode(code: string): Observable<BuildingInfo> {
    return this.http.get<BuildingInfo>(
      `${this.tenantBuildingsUrl}/code/${code}`
    );
  }

  leaveBuilding(): Observable<void> {
    return this.http.post<void>(
      `${this.tenantBuildingsUrl}/my-building/leave`,
      {}
    );
  }
}