import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { finalize } from 'rxjs';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShareAndHelpService } from '../../core/services/share-and-help.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-create-share-and-help-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-share-and-help-dialog.html',
  styleUrl: './create-share-and-help-dialog.scss'
})
export class CreateShareAndHelpDialog {

  title = '';
  description = '';
  imageUrl = '';

  isSubmitting = false;

  constructor(
    private readonly dialogRef: MatDialogRef<CreateShareAndHelpDialog>,
    private readonly service: ShareAndHelpService,
    private readonly notificationService: NotificationService
  ) { }

  create(): void {
    if (!this.title.trim() || !this.description.trim()) {
      return;
    }

    this.isSubmitting = true;

    this.service.create({
      title: this.title.trim(),
      description: this.description.trim(),
      imageUrl: this.imageUrl.trim() || null
    }).pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: () => {
        this.notificationService.success('Post created successfully.');
        this.dialogRef.close(true);
      },
      error: () => {
        this.notificationService.error('Could not create post.');
      }
    });
  }

  

  cancel(): void {
    this.dialogRef.close(false);
  }
}