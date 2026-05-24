import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


export type NotificationType =
  | 'ANNOUNCEMENT'
  | 'SHARE_AND_HELP'
  | 'CHAT';

export interface NotificationItem {
  id: string;
  userId: number;
  buildingId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  readAt?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/notifications';
  private readonly snackBar = inject(MatSnackBar);

  getMyNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.baseUrl);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count`);
  }

  markAsRead(notificationId: string): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(
      `${this.baseUrl}/${notificationId}/read`,
      {}
    );
  }

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000
    });
  }
}