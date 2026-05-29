import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, Subscription, take } from 'rxjs';

import {
  NotificationItem,
  NotificationService
} from './notification.service';

import { NotificationWebSocketService } from './notification-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {

  private readonly notificationService = inject(NotificationService);
  private readonly notificationWebSocketService = inject(NotificationWebSocketService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly notificationsSubject =
    new BehaviorSubject<NotificationItem[]>([]);

  private readonly unreadCountSubject =
    new BehaviorSubject<number>(0);

  private readonly latestNotificationSubject =
    new BehaviorSubject<NotificationItem | null>(null);

  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly unreadCount$ = this.unreadCountSubject.asObservable();
  readonly latestNotification$ = this.latestNotificationSubject.asObservable();

  private initializedUserId?: number;
  private websocketSubscription?: Subscription;

  initialize(userId: number): void {
    if (this.initializedUserId === userId) {
      return;
    }

    this.reset();

    this.initializedUserId = userId;

    this.loadNotifications();
    this.loadUnreadCount();

    this.websocketSubscription =
      this.notificationWebSocketService.notifications$
        .subscribe(notification => {
          this.handleRealtimeNotification(notification);
        });

    this.notificationWebSocketService.connect(userId);
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;

    const optimisticNotifications = currentNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true, readAt: new Date().toISOString() }
        : notification
    );

    this.notificationsSubject.next(optimisticNotifications);
    this.updateUnreadCount(optimisticNotifications);

    this.notificationService.markAsRead(notificationId)
      .pipe(take(1))
      .subscribe({
        next: updatedNotification => {
          this.updateNotification(updatedNotification);
        },
        error: error => {
          console.error('FAILED TO MARK NOTIFICATION AS READ:', error);

          this.notificationsSubject.next(currentNotifications);
          this.updateUnreadCount(currentNotifications);
        }
      });
  }

  reset(): void {
    this.initializedUserId = undefined;

    this.websocketSubscription?.unsubscribe();
    this.websocketSubscription = undefined;

    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    this.latestNotificationSubject.next(null);

    this.notificationWebSocketService.disconnect();
  }

  private loadNotifications(): void {
    this.notificationService.getMyNotifications()
      .pipe(take(1))
      .subscribe({
        next: notifications => {
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount(notifications);
        },
        error: error => {
          console.error('FAILED TO LOAD NOTIFICATIONS:', error);
        }
      });
  }

  private loadUnreadCount(): void {
    this.notificationService.getUnreadCount()
      .pipe(take(1))
      .subscribe({
        next: count => {
          this.unreadCountSubject.next(count);
        },
        error: error => {
          console.error('FAILED TO LOAD UNREAD COUNT:', error);
        }
      });
  }

  private handleRealtimeNotification(notification: NotificationItem): void {
    const currentNotifications = this.notificationsSubject.value;

    const alreadyExists = currentNotifications.some(current =>
      current.id === notification.id
    );

    const updatedNotifications = alreadyExists
      ? currentNotifications.map(current =>
        current.id === notification.id ? notification : current
      )
      : [
        notification,
        ...currentNotifications
      ];

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);

    if (!alreadyExists && !notification.read) {
      this.latestNotificationSubject.next(notification);
      this.showNotificationPopup(notification);
    }
  }

  private updateNotification(updatedNotification: NotificationItem): void {
    const updatedNotifications =
      this.notificationsSubject.value.map(notification =>
        notification.id === updatedNotification.id
          ? updatedNotification
          : notification
      );

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  private updateUnreadCount(notifications: NotificationItem[]): void {
    this.unreadCountSubject.next(
      notifications.filter(notification => !notification.read).length
    );
  }

  private showNotificationPopup(notification: NotificationItem): void {
    this.snackBar.open(
      notification.title,
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );
  }
}