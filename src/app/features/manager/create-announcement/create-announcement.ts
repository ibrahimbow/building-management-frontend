import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BuildingService } from '../../../core/services/building.service';
import { AnnouncementService } from '../../../core/services/announcement.service';
import {
  AnnouncementCategory,
  CreateAnnouncementRequest
} from '../../../core/models/announcement.model';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './create-announcement.html',
  styleUrl: './create-announcement.scss'
})
export class CreateAnnouncement implements OnInit {

  private readonly buildingService = inject(BuildingService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  hasBuilding = false;
  isReady = false;
  isSubmitting = false;

  title = '';
  message = '';
  category: AnnouncementCategory = 'GENERAL';
  imageUrl = '';

  readonly categories: AnnouncementCategory[] = [
    'GENERAL',
    'MAINTENANCE',
    'EMERGENCY',
    'EVENT',
    'REMINDER',
    'SAFETY'
  ];

  ngOnInit(): void {
    this.checkManagerBuilding();
  }

  createAnnouncement(form: NgForm): void {
    if (form.invalid || !this.hasBuilding || this.isSubmitting) {
      form.form.markAllAsTouched();
      return;
    }

    const request: CreateAnnouncementRequest = {
      title: this.title.trim(),
      message: this.message.trim(),
      category: this.category,
      imageUrl: this.imageUrl.trim() || null
    };

    this.isSubmitting = true;

    this.announcementService.createAnnouncement(request).pipe(
      finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Announcement created successfully.', 'Close', {
          duration: 2500
        });

        this.router.navigateByUrl('/manager/announcements');
      },
      error: () => {
        this.snackBar.open('Could not create announcement.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private checkManagerBuilding(): void {
    this.buildingService.getMyManagedBuilding().subscribe({
      next: (building) => {
        this.hasBuilding = building !== null;
        this.isReady = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasBuilding = false;
        this.isReady = true;
        this.cdr.markForCheck();
      }
    });
  }
}