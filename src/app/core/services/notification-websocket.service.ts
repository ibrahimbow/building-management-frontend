import { Injectable, NgZone, inject } from '@angular/core';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

import { NotificationItem } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebSocketService {

  private readonly ngZone = inject(NgZone);

  private stompClient?: Client;
  private subscription?: StompSubscription;

  private readonly notificationSubject = new Subject<NotificationItem>();

  readonly notifications$: Observable<NotificationItem> =
    this.notificationSubject.asObservable();

  connect(userId: number): void {
    console.log('Connecting notification WebSocket for user:', userId);

    if (this.stompClient?.active) {
      console.log('Notification WebSocket already active');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS('/ws/notifications'),

      reconnectDelay: 5000,

      debug: message => {
        console.log('[NOTIFICATION-STOMP]', message);
      },

      onConnect: () => {
        console.log('Notification WebSocket connected');

        const topic = `/topic/users/${userId}/notifications`;

        console.log('Subscribing to:', topic);

        this.subscription = this.stompClient?.subscribe(
          topic,
          (message: IMessage) => {
            console.log('Notification received:', message.body);

            const notification = JSON.parse(message.body) as NotificationItem;

            this.ngZone.run(() => {
              this.notificationSubject.next(notification);
            });
          }
        );
      },

      onStompError: frame => {
        console.error('Notification STOMP error:', frame);
      },

      onWebSocketError: error => {
        console.error('Notification WebSocket error:', error);
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.stompClient?.deactivate();

    this.subscription = undefined;
    this.stompClient = undefined;
  }
}