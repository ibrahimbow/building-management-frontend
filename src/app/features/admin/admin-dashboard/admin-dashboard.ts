import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {

  private readonly router = inject(Router);

  goToAnnouncements(): void {
    this.router.navigate(['/admin/announcements']);
  }

  goToShareAndHelp(): void {
    this.router.navigate(['/admin/share-and-help']);
  }

  goToChat(): void {
    this.router.navigate(['/admin/chat']);
  }
}