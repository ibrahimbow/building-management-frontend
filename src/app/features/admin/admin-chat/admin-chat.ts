import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

import { finalize, Subject, takeUntil } from 'rxjs';

import { AdminChatMessage } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-chat.html',
  styleUrl: './admin-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminChat implements OnInit, OnDestroy {

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  private readonly adminService = inject(AdminService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  messages: AdminChatMessage[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadMessages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteMessage(messageId: string): void {
    this.adminService.deleteChatMessage(messageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messages = this.messages.filter(
            message => message.id !== messageId
          );

          this.notificationService.success('Message deleted successfully.');
          this.cdr.markForCheck();
        },
        error: () => {
          this.notificationService.error('Could not delete message.');
          this.cdr.markForCheck();
        }
      });
  }

  trackByMessageId(
    index: number,
    message: AdminChatMessage
  ): string {
    return message.id;
  }

  private loadMessages(): void {
    this.isLoading = true;

    this.adminService.getChatMessages()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
          this.scrollToBottom();
        })
      )
      .subscribe({
        next: messages => {
          this.messages = messages;
        },
        error: () => {
          this.messages = [];
          this.notificationService.error('Could not load chat messages.');
        }
      });
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      if (!this.messagesContainer) {
        return;
      }

      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }
}