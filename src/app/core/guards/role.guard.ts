import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;

  if (!allowedRoles?.length || authService.hasAnyRole(allowedRoles)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};