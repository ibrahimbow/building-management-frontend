import { Routes } from '@angular/router';


export const routes: Routes = [

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
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
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard', loadComponent: () =>
          import('./features/tenant/tenant-dashboard/tenant-dashboard')
            .then(m => m.TenantDashboard)
      },
      {
        path: 'join-building', loadComponent: () =>
          import('./features/tenant/join-building/join-building')
            .then(m => m.JoinBuilding)
      },
      {
        path: 'building-info', loadComponent: () =>
          import('./features/tenant/building-info/building-info')
            .then(m => m.BuildingInfo)
      },
      {
        path: 'announcements', loadComponent: () =>
          import('./features/tenant/announcements/announcements')
            .then(m => m.Announcements)
      },
      {
        path: 'help-share',
        loadComponent: () =>
          import('./features/tenant/share-and-help/share-and-help')
            .then(m => m.ShareAndHelpComponent)
      },
      {
        path: 'help-share',
        loadComponent: () =>
          import('./features/tenant/share-and-help/share-and-help')
            .then(m => m.ShareAndHelpComponent)
      },
      {
        path: 'resident-chat', loadComponent: () =>
          import('./features/tenant/resident-chat/resident-chat')
            .then(m => m.ResidentChat)
      },
      {
        path: 'settings', loadComponent: () =>
          import('./features/tenant/settings/settings')
            .then(m => m.Settings)
      }
    ]

  },
  {
    path: 'manager/create-announcement',
    loadComponent: () =>
      import('./features/manager/create-announcement/create-announcement')
        .then(m => m.CreateAnnouncement)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
