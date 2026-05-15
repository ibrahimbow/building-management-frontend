import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize, Observable, of, switchMap } from 'rxjs';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShareAndHelpService } from '../../core/services/share-and-help.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadedFile } from '../../core/models/uploaded-file.model';

@Component({
  selector: 'app-create-share-and-help-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-share-and-help-dialog.html',
  styleUrl: './create-share-and-help-dialog.scss'
})
export class CreateShareAndHelpDialog {

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(120)
      ]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(2000)
      ]
    })
  });

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isSubmitting = false;

  constructor(
    private readonly dialogRef: MatDialogRef<CreateShareAndHelpDialog>,
    private readonly shareAndHelpService: ShareAndHelpService,
    private readonly fileUploadService: FileUploadService,
    private readonly notificationService: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.clearSelectedImage();
      return;
    }

    this.clearSelectedImage();
    this.selectedFile = file;

    setTimeout(() => {
      this.imagePreviewUrl = URL.createObjectURL(file);
      this.changeDetectorRef.detectChanges();
    }, 0);

    input.value = '';
  }

  removeImage(): void {
    this.clearSelectedImage();
    this.changeDetectorRef.detectChanges();
  }

  create(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.changeDetectorRef.detectChanges();

    const upload$: Observable<UploadedFile | null> = this.selectedFile
      ? this.fileUploadService.upload(
          this.selectedFile,
          'SHARE_AND_HELP_IMAGE'
        )
      : of(null);

    upload$.pipe(
      switchMap(uploadedFile =>
        this.shareAndHelpService.create({
          title: this.form.controls.title.value.trim(),
          description: this.form.controls.description.value.trim(),
          imageUrl: uploadedFile?.url ?? null
        })
      ),
      finalize(() => {
        setTimeout(() => {
          this.isSubmitting = false;
          this.changeDetectorRef.detectChanges();
        }, 0);
      })
    ).subscribe({
      next: () => {
        setTimeout(() => {
          this.notificationService.success('Post created successfully.');
          this.dialogRef.close(true);
        }, 0);
      },
      error: error => {
        console.error('Could not create Share & Help post:', error);

        setTimeout(() => {
          this.notificationService.error('Could not create post.');
        }, 0);
      }
    });
  }

  cancel(): void {
    if (this.isSubmitting) {
      return;
    }

    this.dialogRef.close(false);
  }

  private clearSelectedImage(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }
}