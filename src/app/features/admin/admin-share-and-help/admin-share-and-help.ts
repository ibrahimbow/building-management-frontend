import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { finalize, Subject, takeUntil } from 'rxjs';

import { AdminShareAndHelpPost } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-share-and-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-share-and-help.html',
  styleUrl: './admin-share-and-help.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminShareAndHelp implements OnInit, OnDestroy {

  private readonly adminService = inject(AdminService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  posts: AdminShareAndHelpPost[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deletePost(postId: string): void {
    this.adminService.deleteShareAndHelpPost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(
            post => post.id !== postId
          );

          this.notificationService.success('Post deleted successfully.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.notificationService.error('Could not delete post.');
          this.cdr.markForCheck();
        }
      });
  }

  deleteComment(
    postId: string,
    commentId: string
  ): void {
    this.adminService.deleteShareAndHelpComment(postId, commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.map(post => {
            if (post.id !== postId) {
              return post;
            }

            return {
              ...post,
              comments: post.comments.filter(
                comment => comment.id !== commentId
              )
            };
          });

          this.notificationService.success('Comment deleted successfully.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.notificationService.error('Could not delete comment.');
          this.cdr.markForCheck();
        }
      });
  }

  trackByPostId(
    index: number,
    post: AdminShareAndHelpPost
  ): string {
    return post.id;
  }

  private loadPosts(): void {
    this.isLoading = true;

    this.adminService.getShareAndHelpPosts()
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