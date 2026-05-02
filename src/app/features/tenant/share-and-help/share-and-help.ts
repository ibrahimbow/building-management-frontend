import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import {
  ShareAndHelp,
  ShareAndHelpComment
} from '../../../core/models/share-and-help';

import { ShareAndHelpService } from '../../../core/services/share-and-help.service';
import { AuthService } from '../../../core/services/auth.service';

import { CreateShareAndHelpDialog } from '../../../shared/create-share-and-help-dialog/create-share-and-help-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-share-and-help',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './share-and-help.html',
  styleUrl: './share-and-help.scss'
})
export class ShareAndHelpComponent {
  posts$: Observable<ShareAndHelp[]>;

  commentTextByPostId: Record<string, string> = {};

  constructor(
    private service: ShareAndHelpService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {
    this.posts$ = this.service.posts$;
  }

  openCreateDialog(): void {
    this.dialog.open(CreateShareAndHelpDialog, {
      width: '600px'
    });
  }

  delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'Are you sure you want to delete this post?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(id);
      }
    });
  }

  addComment(postId: string): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }

    const text = this.commentTextByPostId[postId]?.trim();

    if (!text) {
      return;
    }

    const settings = localStorage.getItem(`bm_user_settings_${user.id}`);
    const avatarUrl = settings ? JSON.parse(settings).avatarUrl : '';

    const comment: ShareAndHelpComment = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
      createdByUserId: user.id,
      createdByNickname: user.nickname,
      createdByAvatarUrl: avatarUrl
    };

    this.service.addComment(postId, comment);
    this.commentTextByPostId[postId] = '';
  }

  deleteComment(postId: string, commentId: string): void {
    this.service.deleteComment(postId, commentId);
  }

  visibleCommentsByPostId: Record<string, number> = {};

  getVisibleCommentCount(postId: string): number {
    return this.visibleCommentsByPostId[postId] ?? 3;
  }

  loadMoreComments(postId: string): void {
    this.visibleCommentsByPostId[postId] =
      this.getVisibleCommentCount(postId) + 3;
  }
}