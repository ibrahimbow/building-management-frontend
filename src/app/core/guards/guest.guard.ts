import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return true;
  }

  if (currentUser.role === 'MANAGER') {
    return router.createUrlTree(['/manager/dashboard']);
  }

  if (currentUser.role === 'TENANT') {
    return router.createUrlTree(['/tenant/dashboard']);
  }

  if (currentUser.role === 'ADMIN') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return router.createUrlTree(['/unauthorized']);
};