import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShareAndHelpService } from '../../core/services/share-and-help.service';
import { AuthService } from '../../core/services/auth.service';

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
  images: string[] = [];
  imagePreview: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateShareAndHelpDialog>,
    private service: ShareAndHelpService,
    private authService: AuthService
  ) {}

  onImageSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = reader.result as string;
        this.images.push(image);
        this.imagePreview.push(image);
      };

      reader.readAsDataURL(file);
    });
  }

  create(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    if (!this.title.trim() || !this.description.trim()) {
      alert('Title and description are required.');
      return;
    }

    const settings = localStorage.getItem(`bm_user_settings_${user.id}`);
    const avatarUrl = settings ? JSON.parse(settings).avatarUrl : '';

    this.service.add({
      id: crypto.randomUUID(),
      title: this.title,
      description: this.description,
      createdAt: new Date().toISOString(),

      createdByUserId: user.id.toString(),
      createdByDisplayName: user.displayName,
      createdByAvatarUrl: avatarUrl,

      images: this.images,

      comments: []
    });

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}