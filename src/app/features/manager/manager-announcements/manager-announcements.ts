import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Announcement } from '../../../core/models/announcement.model';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { BuildingService } from '../../../core/services/building.service';


@Component({
  selector: 'app-manager-announcements',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TimeAgoPipe
  ],
  templateUrl: './manager-announcements.html',
  styleUrl: './manager-announcements.scss'
})
export class ManagerAnnouncements implements OnInit {

  private readonly announcementService = inject(AnnouncementService);
  private readonly buildingService = inject(BuildingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);


  announcements: Announcement[] = [];
  isLoading = true;
  isDeleting = false;

  ngOnInit(): void {
    this.validateManagerBuilding();
  }

  private validateManagerBuilding(): void {
    this.isLoading = true;

    this.buildingService.getMyManagedBuilding().subscribe({
      next: (building) => {
        if (!building) {
          this.isLoading = false;
          this.cdr.markForCheck();
          this.router.navigate(['/manager/create-building']);
          return;
        }

        this.loadAnnouncements();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/manager/create-building']);
      }
    });
  }

  private loadAnnouncements(): void {
    this.announcementService.getManagerAnnouncements().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (announcements) => {
        this.announcements = announcements;
      },
      error: () => {
        this.snackBar.open('Could not load announcements.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteAnnouncement(id: string): void {
    this.isDeleting = true;

    this.announcementService.deleteAnnouncement(id).pipe(
      finalize(() => {
        this.isDeleting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.announcements = this.announcements.filter(
          announcement => announcement.id !== id
        );

        this.snackBar.open('Announcement deleted.', 'Close', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Could not delete announcement.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  hasValidImage(imageUrl: string | null | undefined): boolean {
    return !!imageUrl && imageUrl.startsWith('http');
  }


}