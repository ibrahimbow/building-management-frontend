import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Observable } from 'rxjs';
import { Announcement } from '../../../core/models/announcement';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss'
})
export class Announcements {
  announcements$: Observable<Announcement[]>;

  constructor(private announcementService: AnnouncementService, 
    private dialog: MatDialog,
    public authService: AuthService) {
    this.announcements$ = this.announcementService.announcements$;
  }

  delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'Are you sure you want to delete this announcement?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.announcementService.deleteAnnouncement(id);
      }
    });
  }

}