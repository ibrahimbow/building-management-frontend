import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, Observable, of, switchMap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { BuildingService } from '../../../core/services/building.service';
import { AnnouncementService } from '../../../core/services/announcement.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { UploadedFile } from '../../../core/models/uploaded-file.model';
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
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './create-announcement.html',
  styleUrl: './create-announcement.scss'
})
export class CreateAnnouncement implements OnInit, OnDestroy {

  private readonly buildingService   = inject(BuildingService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly snackBar          = inject(MatSnackBar);
  private readonly router            = inject(Router);
  private readonly cdr               = inject(ChangeDetectorRef);

  // ── State ──────────────────────────────────────────────────────────
  hasBuilding  = false;
  isReady      = false;
  isSubmitting = false;
  errorMessage = '';

  // ── Form fields ────────────────────────────────────────────────────
  title    = '';
  message  = '';
  category: AnnouncementCategory = 'GENERAL';

  // ── Image upload ───────────────────────────────────────────────────
  selectedFile:    File   | null = null;
  imagePreviewUrl: string | null = null;

  readonly categories: AnnouncementCategory[] = [
    'GENERAL',
    'MAINTENANCE',
    'EMERGENCY',
    'EVENT',
    'REMINDER',
    'SAFETY'
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────
  ngOnInit(): void {
    this.checkManagerBuilding();
  }

  ngOnDestroy(): void {
    // Release the object URL to avoid memory leaks
    this.clearSelectedImage();
  }

  // ── Image handlers ─────────────────────────────────────────────────
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0] ?? null;

    if (!file) {
      this.clearSelectedImage();
      return;
    }

    this.clearSelectedImage();
    this.selectedFile = file;

    setTimeout(() => {
      this.imagePreviewUrl = URL.createObjectURL(file);
      this.cdr.markForCheck();
    }, 0);

    // Reset input so the same file can be re-selected after removal
    input.value = '';
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0] ?? null;

    if (!file) return;

    this.clearSelectedImage();
    this.selectedFile = file;

    setTimeout(() => {
      this.imagePreviewUrl = URL.createObjectURL(file);
      this.cdr.markForCheck();
    }, 0);
  }

  removeImage(): void {
    this.clearSelectedImage();
    this.cdr.markForCheck();
  }

  // ── Form validation ────────────────────────────────────────────────
  get isFormReady(): boolean {
    return (
      this.hasBuilding &&
      this.isTitleValid() &&
      this.isMessageValid() &&
      this.isCategoryValid()
    );
  }

  isTitleValid(): boolean {
    const v = this.title.trim();
    return v.length >= 3 && v.length <= 255;
  }

  isMessageValid(): boolean {
    const v = this.message.trim();
    return v.length >= 10 && v.length <= 5000;
  }

  isCategoryValid(): boolean {
    return this.categories.includes(this.category);
  }

  // ── Submit ─────────────────────────────────────────────────────────
  createAnnouncement(form: NgForm): void {
    this.errorMessage = '';
    this.trimFormValues();

    if (form.invalid || !this.isFormReady || this.isSubmitting) {
      form.form.markAllAsTouched();
      this.errorMessage = 'Please correct the highlighted fields.';
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    // 1. Upload image if one was selected, otherwise emit null
    const upload$: Observable<UploadedFile | null> = this.selectedFile
      ? this.fileUploadService.upload(this.selectedFile, 'ANNOUNCEMENT_IMAGE')
      : of(null);

    // 2. Pipe the (optional) uploaded URL into the create request
    upload$.pipe(
      switchMap(uploadedFile => {
        const request: CreateAnnouncementRequest = {
          title:    this.title,
          message:  this.message,
          category: this.category,
          imageUrl: uploadedFile?.url ?? null
        };
        return this.announcementService.createAnnouncement(request);
      }),
      finalize(() => {
        setTimeout(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }, 0);
      })
    ).subscribe({
      next: () => {
        setTimeout(() => {
          this.snackBar.open('Announcement created successfully.', 'Close', {
            duration: 2500
          });
          this.router.navigateByUrl('/manager/announcements', { replaceUrl: true });
        }, 0);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Some fields are invalid. Please check your announcement details.';
          return;
        }
        setTimeout(() => {
          this.snackBar.open('Could not create announcement.', 'Close', { duration: 3000 });
        }, 0);
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────
  private trimFormValues(): void {
    this.title   = this.title.trim();
    this.message = this.message.trim();
  }

  private clearSelectedImage(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.selectedFile    = null;
    this.imagePreviewUrl = null;
  }

  private checkManagerBuilding(): void {
    this.buildingService.getMyManagedBuilding().subscribe({
      next: (building) => {
        this.hasBuilding = building !== null;
        this.isReady     = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasBuilding = false;
        this.isReady     = true;
        this.cdr.markForCheck();
      }
    });
  }
}