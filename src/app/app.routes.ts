import { Routes } from '@angular/router';


export const routes: Routes = [

    {path : '', redirectTo: 'auth/login', pathMatch: 'full'},
  
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
  path: 'tenant/dashboard',
  loadComponent: () =>
    import('./features/tenant/tenant-dashboard/tenant-dashboard')
      .then(m => m.TenantDashboard)
},
  {
    path: 'tenant/join-building',
    loadComponent: () =>
      import('./features/tenant/join-building/join-building')
        .then(m => m.JoinBuilding)
  },
  {
    path: 'tenant/building-info',
    loadComponent: () =>
      import('./features/tenant/building-info/building-info')
        .then(m => m.BuildingInfo)
  },
  {
    path: 'tenant/announcements',
    loadComponent: () =>
      import('./features/tenant/announcements/announcements')
        .then(m => m.Announcements)
  },
  {
    path: 'tenant/help-share',
    loadComponent: () =>
      import('./features/tenant/help-share/help-share')
        .then(m => m.HelpShare)
  },
  {
    path: 'tenant/resident-chat',
    loadComponent: () =>
      import('./features/tenant/resident-chat/resident-chat')
        .then(m => m.ResidentChat)
  },
  {
    path: 'tenant/settings',
    loadComponent: () =>
      import('./features/tenant/settings/settings')
        .then(m => m.Settings)
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
