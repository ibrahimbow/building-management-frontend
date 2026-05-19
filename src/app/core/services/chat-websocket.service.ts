import { Injectable, NgZone, inject } from '@angular/core';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

import { ChatWebSocketEvent } from '../models/chat-websocket-event.model';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {

  private readonly ngZone = inject(NgZone);

  private stompClient?: Client;
  private subscription?: StompSubscription;

  private readonly eventSubject = new Subject<ChatWebSocketEvent>();

  readonly events$: Observable<ChatWebSocketEvent> =
    this.eventSubject.asObservable();

  connect(buildingId: string): void {
    console.log('Connecting WebSocket for building:', buildingId);

    if (this.stompClient?.active) {
      console.log('WebSocket already active');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS('http://localhost:8080/ws/chat'),

      reconnectDelay: 5000,

      debug: message => {
        console.log('[STOMP]', message);
      },

      onConnect: () => {
        console.log('WebSocket connected');

        const topic = `/topic/buildings/${buildingId}/chat/messages`;

        console.log('Subscribing to:', topic);

        this.subscription = this.stompClient?.subscribe(
          topic,
          (message: IMessage) => {
            console.log('WebSocket message received:', message.body);

            const event = JSON.parse(message.body) as ChatWebSocketEvent;

            this.ngZone.run(() => {
              this.eventSubject.next(event);
            });
          }
        );
      },

      onStompError: frame => {
        console.error('STOMP error:', frame);
      },

      onWebSocketError: error => {
        console.error('WebSocket error:', error);
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