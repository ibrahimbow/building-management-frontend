import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss',
})
export class TenantDashboard {
  hasJoinedBuilding = false; // later this comes from backend

  menuItems = [
    {
      title: this.hasJoinedBuilding ? 'Building Info' : 'Join Building',
      description: this.hasJoinedBuilding
        ? 'View your building details, rules and contacts'
        : 'Enter a building code to request access',
      icon: this.hasJoinedBuilding ? 'business' : 'add_business',
      route: this.hasJoinedBuilding ? '/tenant/building-info' : '/tenant/join-building',
      notificationCount: 0
    },
    {
      title: 'Announcements',
      description: 'Read updates from your building manager',
      icon: 'campaign',
      route: '/tenant/announcements',
      notificationCount: 4
    },
    {
      title: 'Chat',
      description: 'Chat with manager or neighbors',
      icon: 'chat',
      route: '/tenant/resident-chat',
      notificationCount: 8
    },
    {
      title: 'Help & Share',
      description: 'Invite others or get help',
      icon: 'share',
      route: '/tenant/help-share',
      notificationCount: 1
    }
  ];
}