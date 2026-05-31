import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  Building,
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

  createBuilding(request: CreateBuildingRequest): Observable<Building> {
    return this.http.post<Building>(this.managerBuildingsUrl, request);
  }

  getMyManagedBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.managerBuildingsUrl);
  }

  getMyManagedBuilding(): Observable<Building | null> {
    return this.getMyManagedBuildings().pipe(
      map(buildings => buildings.length > 0 ? buildings[0] : null)
    );
  }

  getMyBuildingById(id: string): Observable<Building> {
    return this.http.get<Building>(`${this.managerBuildingsUrl}/${id}`);
  }

  updateMyBuilding(
    id: string,
    request: UpdateBuildingRequest
  ): Observable<Building> {
    return this.http.put<Building>(
      `${this.managerBuildingsUrl}/${id}`,
      request
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

  getMyJoinedBuilding(): Observable<Building> {
    return this.http.get<Building>(
      `${this.tenantBuildingsUrl}/my-building`
    );
  }

  getCurrentBuildingForChat(isManagerOrAdmin: boolean): Observable<Building | null> {
    return isManagerOrAdmin
      ? this.getMyManagedBuilding()
      : this.getMyJoinedBuilding();
  }

  joinBuilding(code: string): Observable<Building> {
    return this.http.post<Building>(
      `${this.tenantBuildingsUrl}/join`,
      { code }
    );
  }

  getBuildingByCode(code: string): Observable<Building> {
    return this.http.get<Building>(
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