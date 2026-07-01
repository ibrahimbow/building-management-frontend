import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { buildingGuard } from './core/guards/buildingGuard';

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
        canActivate: [buildingGuard],
        loadComponent: () =>
          import('./features/tenant/building-details/building-details')
            .then(m => m.BuildingDetails)
      },
      {
        path: 'announcements',
        canActivate: [buildingGuard],
        loadComponent: () =>
          import('./features/tenant/tenant-announcements/tenant-announcements')
            .then(m => m.TenantAnnouncements)
      },
      {
        path: 'help-share',
        canActivate: [buildingGuard],
        loadComponent: () =>
          import('./shared/share-and-help/share-and-help')
            .then(m => m.ShareAndHelpComponent)
      },
      {
        path: 'building-chat',
        canActivate: [buildingGuard],
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
    data: { roles: ['MANAGER'] },
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
      },
      {
        path: 'buildings/:id/edit',
        loadComponent: () =>
          import('./features/manager/update-building/update-building')
            .then(m => m.UpdateBuilding)
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
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
          import('./features/admin/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./features/admin/admin-announcements/admin-announcements')
            .then(m => m.AdminAnnouncements)
      },
      {
        path: 'share-and-help',
        loadComponent: () =>
          import('./features/admin/admin-share-and-help/admin-share-and-help')
            .then(m => m.AdminShareAndHelp)
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/admin/admin-chat/admin-chat')
            .then(m => m.AdminChat)
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./features/admin/admin-audit/admin-audit')
            .then(m => m.AdminAudit)
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
  },
];