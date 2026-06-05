import { Injectable, NgZone, inject } from '@angular/core';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

import { ChatWebSocketEvent } from '../models/chat-websocket-event.model';
import { environment } from '../../../environments/environment';

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
  brokerURL: `${environment.webSocketBaseUrl.replace('http', 'ws')}/ws/chat/websocket`,

  reconnectDelay: 5000,

  debug: message => {
    console.log('[STOMP]', message);
  },

  onConnect: () => {
    const topic = `/topic/buildings/${buildingId}/chat/messages`;

    this.subscription = this.stompClient?.subscribe(
      topic,
      (message: IMessage) => {
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