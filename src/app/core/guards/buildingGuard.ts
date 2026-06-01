import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BuildingService } from '../services/building.service';
import { map, catchError, of } from 'rxjs';

export const buildingGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const buildingService = inject(BuildingService);
  const router = inject(Router);

  const isManager = route.pathFromRoot
    .some(r => r.url.some(seg => seg.path === 'MANAGER'));

  const fallback = isManager ? '/manager/dashboard' : '/tenant/dashboard';

  return buildingService.getMyJoinedBuilding().pipe(
    map(building => building ? true : router.createUrlTree([fallback])),
    catchError(() => of(router.createUrlTree([fallback])))
  );
};