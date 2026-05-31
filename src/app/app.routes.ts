import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register)
  }, {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register)
  },

  {
    path: 'tenant',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TENANT'] },
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/tenant/tenant-dashboard/tenant-dashboard')
            .then(m => m.TenantDashboard)
      },
      {
        path: 'join-building',
        loadComponent: () =>
          import('./features/tenant/join-building/join-building')
            .then(m => m.JoinBuilding)
      },
      {
        path: 'building-details',
        loadComponent: () =>
          import('./features/tenant/building-details/building-details')
            .then(m => m.BuildingDetails)
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./features/tenant/tenant-announcements/tenant-announcements')
            .then(m => m.TenantAnnouncements)
      },
      {
        path: 'help-share',
        loadComponent: () =>
          import('./shared/share-and-help/share-and-help')
            .then(m => m.ShareAndHelpComponent)
      },
      {
        path: 'building-chat',
        loadComponent: () =>
          import('./shared/building-chat/building-chat')
            .then(m => m.BuildingChat)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/tenant/settings/settings')
            .then(m => m.Settings)
      }
    ]
  },

  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER', 'ADMIN'] },
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/manager/manager-dashboard/manager-dashboard')
            .then(m => m.ManagerDashboard)
      },
      {
        path: 'create-building',
        loadComponent: () =>
          import('./features/manager/create-building/create-building')
            .then(m => m.CreateBuilding)
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./features/manager/manager-announcements/manager-announcements')
            .then(m => m.ManagerAnnouncements)
      },
      {
        path: 'announcements/create',
        loadComponent: () =>
          import('./features/manager/create-announcement/create-announcement')
            .then(m => m.CreateAnnouncement)
      },
      {
        path: 'announcements/:id/edit',
        loadComponent: () =>
          import('./features/manager/edit-announcement/edit-announcement')
            .then(m => m.EditAnnouncement)
      },
      {
        path: 'building-tenants',
        loadComponent: () =>
          import('./features/manager/building-tenants/building-tenants')
            .then(m => m.BuildingTenants)
      },
      {
        path: 'building-chat',
        loadComponent: () =>
          import('./shared/building-chat/building-chat')
            .then(m => m.BuildingChat)
      },
      {
        path: 'help-share',
        loadComponent: () =>
          import('./shared/share-and-help/share-and-help')
            .then(m => m.ShareAndHelpComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/manager/manager-settings/manager-settings')
            .then(m => m.ManagerSettings)
      }
    ]
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized')
        .then(m => m.Unauthorized)
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];