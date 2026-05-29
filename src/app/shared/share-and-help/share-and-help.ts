import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { finalize, Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { ShareAndHelp } from '../../core/models/share-and-help';
import { ShareAndHelpService } from '../../core/services/share-and-help.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

import { CreateShareAndHelpDialog } from '../create-share-and-help-dialog/create-share-and-help-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

import { TimeAgoPipe } from '../../core/pipes/time-ago-pipe';

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
    MatInputModule,
    TimeAgoPipe
  ],
  templateUrl: './share-and-help.html',
  styleUrl: './share-and-help.scss'
})
export class ShareAndHelpComponent implements OnInit, OnDestroy {

  private readonly service = inject(ShareAndHelpService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  readonly authService = inject(AuthService);

  posts: ShareAndHelp[] = [];
  isLoading = true;

  commentTextByPostId: Record<string, string> = {};
  visibleCommentsByPostId: Record<string, number> = {};

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateShareAndHelpDialog, {
      width: '600px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(created => {
        if (created) {
          this.loadPosts();
        }
      });
  }

  delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'Are you sure you want to delete this post?' },
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (!result) {
          return;
        }

        this.service.delete(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.success('Post deleted successfully.');
              this.loadPosts();
            },
            error: () => {
              this.notificationService.error('Could not delete post.');
            }
          });
      });
  }

  addComment(postId: string): void {
    const text = this.commentTextByPostId[postId]?.trim();

    if (!text) {
      return;
    }

    this.service.addComment(postId, {
      comment: text
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.commentTextByPostId[postId] = '';
          this.loadPosts();
        },
        error: () => {
          this.notificationService.error('Could not add comment.');
        }
      });
  }

  deleteComment(
    postId: string,
    commentId: string
  ): void {
    this.service.deleteComment(postId, commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPosts();
        },
        error: () => {
          this.notificationService.error('Could not delete comment.');
        }
      });
  }

  getVisibleCommentCount(postId: string): number {
    return this.visibleCommentsByPostId[postId] ?? 3;
  }

  loadMoreComments(postId: string): void {
    this.visibleCommentsByPostId[postId] =
      this.getVisibleCommentCount(postId) + 3;
  }

  trackByPostId(
    index: number,
    post: ShareAndHelp
  ): string {
    return post.id;
  }

  hasValidImage(imageUrl: string | null | undefined): boolean {
    return !!imageUrl && imageUrl.trim().length > 0;
  }

resolveImageUrl(imageUrl: string | null | undefined): string {

  if (!imageUrl) {
    return '';
  }

  const normalizedUrl = imageUrl
    .replace('/profile_avatar/', '/PROFILE_AVATAR/')
    .replace('/announcement_image/', '/ANNOUNCEMENT_IMAGE/')
    .replace('/share_and_help_image/', '/SHARE_AND_HELP_IMAGE/')
    .replace('/chat_message_image/', '/CHAT_MESSAGE_IMAGE/');

  if (normalizedUrl.startsWith('http')) {
    return normalizedUrl;
  }

  if (normalizedUrl.startsWith('/')) {
    return `http://localhost:8080${normalizedUrl}`;
  }

  return `http://localhost:8080/${normalizedUrl}`;
}

  private loadPosts(): void {
    this.isLoading = true;

    this.service.getAll()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: posts => {
          this.posts = posts;
        },
        error: () => {
          this.posts = [];
          this.notificationService.error('Could not load Share & Help posts.');
        }
      });
  }
}