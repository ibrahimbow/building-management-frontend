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
    this.notificationService.markAsRead(notificationId)
      .pipe(take(1))
      .subscribe({
        next: updatedNotification => {
          this.updateNotificationAsRead(updatedNotification);
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
        }
      });
  }

  private loadUnreadCount(): void {
    this.notificationService.getUnreadCount()
      .pipe(take(1))
      .subscribe({
        next: count => {
          this.unreadCountSubject.next(count);
        }
      });
  }

  private handleRealtimeNotification(notification: NotificationItem): void {
    this.notificationsSubject.next([
      notification,
      ...this.notificationsSubject.value
    ]);

    this.unreadCountSubject.next(
      this.unreadCountSubject.value + 1
    );

    this.latestNotificationSubject.next(notification);

    this.showNotificationPopup(notification);
  }

  private updateNotificationAsRead(updatedNotification: NotificationItem): void {
    const updatedNotifications =
      this.notificationsSubject.value.map(notification =>
        notification.id === updatedNotification.id
          ? updatedNotification
          : notification
      );

    this.notificationsSubject.next(updatedNotifications);

    this.unreadCountSubject.next(
      updatedNotifications.filter(notification => !notification.read).length
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