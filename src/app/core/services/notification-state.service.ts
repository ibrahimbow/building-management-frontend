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

    this.loadUnreadNotifications();

    this.websocketSubscription =
      this.notificationWebSocketService.notifications$
        .subscribe(notification => {
          this.handleRealtimeNotification(notification);
        });

    this.notificationWebSocketService.connect(userId);
  }

  markAsReadAndRemove(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;

    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);

    this.notificationService.markAsRead(notificationId)
      .pipe(take(1))
      .subscribe({
        error: error => {
          console.error('FAILED TO MARK NOTIFICATION AS READ:', error);

          this.notificationsSubject.next(currentNotifications);
          this.updateUnreadCount(currentNotifications);

          this.notificationService.error('Could not update notification.');
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

  private loadUnreadNotifications(): void {
    this.notificationService.getMyNotifications()
      .pipe(take(1))
      .subscribe({
        next: notifications => {
          const unreadNotifications = notifications.filter(
            notification => !notification.read
          );

          this.notificationsSubject.next(unreadNotifications);
          this.unreadCountSubject.next(unreadNotifications.length);
        },
        error: error => {
          console.error('FAILED TO LOAD NOTIFICATIONS:', error);
        }
      });
  }

  private handleRealtimeNotification(notification: NotificationItem): void {
    if (notification.read) {
      return;
    }

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

    if (!alreadyExists) {
      this.latestNotificationSubject.next(notification);
      this.showNotificationPopup(notification);
    }
  }

  private updateUnreadCount(notifications: NotificationItem[]): void {
    this.unreadCountSubject.next(notifications.length);
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