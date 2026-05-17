import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { finalize, Observable, of, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { NotificationService } from '../../../core/services/notification.service';

import { ChatMessage } from '../../../core/models/chat-message.model';
import { UploadedFile } from '../../../core/models/uploaded-file.model';

import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

interface ChatMessageGroup {
  label: string;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-tenant-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TimeAgoPipe
  ],
  templateUrl: './tenant-chat.html',
  styleUrl: './tenant-chat.scss'
})
export class ResidentChat implements OnInit, AfterViewChecked {

  @ViewChild('messagesArea')
  private messagesArea?: ElementRef<HTMLDivElement>;

  @ViewChild('emojiPickerContainer')
  private emojiPickerContainer?: ElementRef<HTMLElement>;

  private readonly authService = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  private shouldScrollToBottom = false;

  readonly currentUserId = this.authService.getCurrentUser()?.id ?? 0;

  readonly maxMessageLength = 2000;

  readonly emojis = ['👍', '❤️', '😂', '😮', '🙏'];

  readonly composerEmojis = [
    '😀',
    '😂',
    '😍',
    '🔥',
    '❤️',
    '👍',
    '🎉',
    '🙏',
    '😎',
    '🥳'
  ];

  messages: ChatMessage[] = [];

  messageContent = '';

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  previewImageUrl: string | null = null;

  isLoading = true;
  isSending = false;
  showEmojiPicker = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.loadMessages();
    });
  }

  ngAfterViewChecked(): void {
  if (!this.shouldScrollToBottom) return;

  const el = this.messagesArea?.nativeElement;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }

  this.shouldScrollToBottom = false;
}

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closeImagePreview();
    this.showEmojiPicker = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showEmojiPicker) {
      return;
    }

    const target = event.target as Node;

    if (
      this.emojiPickerContainer &&
      !this.emojiPickerContainer.nativeElement.contains(target)
    ) {
      this.showEmojiPicker = false;
    }
  }

  get groupedMessages(): ChatMessageGroup[] {
    const groups = new Map<string, ChatMessage[]>();

    for (const message of this.messages) {
      const label = this.getMessageDateLabel(message.createdAt);
      const currentMessages = groups.get(label) ?? [];

      groups.set(label, [
        ...currentMessages,
        message
      ]);
    }

    return Array.from(groups.entries()).map(([label, messages]) => ({
      label,
      messages
    }));
  }

  loadMessages(): void {
    this.isLoading = true;

    this.chatService.getMessages()
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          });
        })
      )
      .subscribe({
        next: messages => {
          this.messages = messages;
          this.shouldScrollToBottom = true;
        },
        error: error => {
          console.error('Failed to load chat messages:', error);

          this.messages = [];
          this.notificationService.error('Failed to load chat messages.');
        }
      });
  }

  sendMessage(): void {
    const content = this.messageContent.trim();

    if (!content && !this.selectedFile) {
      return;
    }

    if (content.length > this.maxMessageLength) {
      this.notificationService.error(
        `Message must not exceed ${this.maxMessageLength} characters.`
      );

      return;
    }

    this.isSending = true;

    const upload$: Observable<UploadedFile | null> = this.selectedFile
      ? this.fileUploadService.upload(
          this.selectedFile,
          'CHAT_MESSAGE_IMAGE'
        )
      : of(null);

    upload$
      .pipe(
        switchMap(uploadedFile =>
          this.chatService.sendMessage(
            content || null,
            uploadedFile?.url ?? null
          )
        ),
        finalize(() => {
          setTimeout(() => {
            this.isSending = false;
            this.cdr.markForCheck();
          });
        })
      )
      .subscribe({
        next: message => {
          this.messages = [
            ...this.messages,
            message
          ];

          this.messageContent = '';
          this.clearSelectedImage();
          this.shouldScrollToBottom = true;
        },
        error: error => {
          console.error('Failed to send chat message:', error);
          this.notificationService.error('Failed to send message.');
        }
      });
  }

  deleteMessage(message: ChatMessage): void {
    if (!this.isMyMessage(message)) {
      return;
    }

    this.chatService.deleteMessage(message.id)
      .subscribe({
        next: () => {
          this.messages = this.messages.map(currentMessage =>
            currentMessage.id === message.id
              ? {
                  ...currentMessage,
                  deleted: true,
                  content: null,
                  imageUrl: null,
                  reactions: []
                }
              : currentMessage
          );

          this.cdr.markForCheck();
        },
        error: error => {
          console.error('Failed to delete chat message:', error);
          this.notificationService.error('Failed to delete message.');
        }
      });
  }

  reactToMessage(message: ChatMessage,
                 emoji: string): void {
    if (message.deleted) {
      return;
    }

    const previousMessages = this.cloneMessages();
    const alreadyReacted = this.hasReacted(message, emoji);

    this.toggleReactionLocally(message.id, emoji);

    const request$: Observable<unknown> = alreadyReacted
      ? this.chatService.removeReaction(message.id, emoji)
      : this.chatService.reactToMessage(message.id, emoji);

    request$.subscribe({
      error: error => {
        console.error('Reaction failed:', error);

        this.messages = previousMessages;
        this.notificationService.error(
          alreadyReacted
            ? 'Failed to remove reaction.'
            : 'Failed to react to message.'
        );

        this.cdr.markForCheck();
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.clearSelectedImage();
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.notificationService.error('Only image files are allowed.');
      input.value = '';
      return;
    }

    this.clearSelectedImage();

    this.selectedFile = file;
    this.imagePreviewUrl = URL.createObjectURL(file);

    this.cdr.markForCheck();

    input.value = '';
  }

  removeImage(): void {
    this.clearSelectedImage();
    this.cdr.markForCheck();
  }

  addEmoji(emoji: string): void {
    this.messageContent += emoji;
    this.showEmojiPicker = false;
  }

  openImagePreview(imageUrl: string): void {
    this.previewImageUrl = imageUrl;
  }

  closeImagePreview(): void {
    this.previewImageUrl = null;
  }

  resolveImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
      return `http://localhost:8080${imageUrl}`;
    }

    return `http://localhost:8080/${imageUrl}`;
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderUserId === this.currentUserId;
  }

  hasReacted(message: ChatMessage,
             emoji: string): boolean {
    return message.reactions.some(
      reaction => reaction.emoji === emoji && reaction.reactedByCurrentUser
    );
  }

  trackByMessageId(index: number,
                   message: ChatMessage): string {
    return message.id;
  }

  trackByGroupLabel(index: number,
                    group: ChatMessageGroup): string {
    return group.label;
  }

  private toggleReactionLocally(messageId: string,
                                emoji: string): void {
    this.messages = this.messages.map(message => {
      if (message.id !== messageId) {
        return message;
      }

      const existingReaction = message.reactions.find(
        reaction => reaction.emoji === emoji
      );

      if (!existingReaction) {
        return {
          ...message,
          reactions: [
            ...message.reactions,
            {
              emoji,
              count: 1,
              reactedByCurrentUser: true
            }
          ]
        };
      }

      const alreadyReacted = existingReaction.reactedByCurrentUser;

      const updatedReactions = message.reactions
        .map(reaction =>
          reaction.emoji === emoji
            ? {
                ...reaction,
                count: alreadyReacted
                  ? Math.max(reaction.count - 1, 0)
                  : reaction.count + 1,
                reactedByCurrentUser: !alreadyReacted
              }
            : reaction
        )
        .filter(reaction => reaction.count > 0);

      return {
        ...message,
        reactions: updatedReactions
      };
    });

    this.cdr.markForCheck();
  }

  private cloneMessages(): ChatMessage[] {
    return this.messages.map(message => ({
      ...message,
      reactions: message.reactions.map(reaction => ({
        ...reaction
      }))
    }));
  }

  private clearSelectedImage(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }

  private getMessageDateLabel(createdAt: string): string {
    const messageDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return messageDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private scrollToBottom(): void {
    const element = this.messagesArea?.nativeElement;

    if (!element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
  }
}