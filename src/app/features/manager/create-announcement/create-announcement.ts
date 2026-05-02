import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import {
  Announcement,
  AnnouncementCategory
} from '../../../core/models/announcement';

import { AnnouncementService } from '../../../core/services/announcement.service';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './create-announcement.html',
  styleUrl: './create-announcement.scss'
})
export class CreateAnnouncement {
  announcement: Announcement = this.getEmptyAnnouncement();
  imagePreview: string | null = null;
  categories: AnnouncementCategory[] = [
    'Maintenance',
    'Safety',
    'Reminder'
  ];

  constructor(
    private announcementService: AnnouncementService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    const newAnnouncement: Announcement = {
      ...this.announcement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      icon: this.getIconByCategory(this.announcement.category),
      images: this.announcement.images ?? []
    };

    this.announcementService.addAnnouncement(newAnnouncement);

    this.snackBar.open('Announcement created successfully!', 'Close', {
      duration: 2000
    });

    this.announcement = this.getEmptyAnnouncement();
    this.imagePreview = null;

    // ✅ Redirect after short delay
    setTimeout(() => {
      this.router.navigate(['/tenant/announcements']);
    }, 1000);
  }

  private getEmptyAnnouncement(): Announcement {
    return {
      id: '',
      title: '',
      message: '',
      category: 'Maintenance',
      createdAt: '',
      icon: 'campaign',
      images: []
    };
  }

  private getIconByCategory(category: AnnouncementCategory): string {
    switch (category) {
      case 'Maintenance':
        return 'build';
      case 'Safety':
        return 'warning';
      case 'Reminder':
        return 'notifications';
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;

      // store image in announcement (base64)
      this.announcement.images = [this.imagePreview!];
    };

    reader.readAsDataURL(file);
  }
}