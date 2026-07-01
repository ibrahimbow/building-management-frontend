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
  private connectedBuildingId?: string;
  private connecting = false;

  private readonly eventSubject = new Subject<ChatWebSocketEvent>();

  readonly events$: Observable<ChatWebSocketEvent> =
    this.eventSubject.asObservable();

  connect(buildingId: string): void {
    if (this.connecting) {
      return;
    }

    if (
      this.stompClient?.active &&
      this.connectedBuildingId === buildingId
    ) {
      return;
    }

    if (this.stompClient?.active) {
      this.disconnect();
    }

    this.connecting = true;
    this.connectedBuildingId = buildingId;

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${environment.webSocketBaseUrl}/ws/chat`),

      reconnectDelay: 5000,

      debug: message => {
        console.log('[CHAT STOMP]', message);
      },

      onConnect: () => {
        this.connecting = false;

        const topic =
          `/topic/buildings/${buildingId}/chat/messages`;

        this.subscription = this.stompClient?.subscribe(
          topic,
          (message: IMessage) => {
            const event =
              JSON.parse(message.body) as ChatWebSocketEvent;

            this.ngZone.run(() => {
              this.eventSubject.next(event);
            });
          }
        );
      },

      onStompError: frame => {
        this.connecting = false;
        console.error('Chat STOMP error:', frame);
      },

      onWebSocketError: error => {
        this.connecting = false;
        console.error('Chat WebSocket error:', error);
      },

      onWebSocketClose: () => {
        this.connecting = false;
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    this.subscription?.unsubscribe();

    if (this.stompClient?.active) {
      void this.stompClient.deactivate();
    }

    this.subscription = undefined;
    this.stompClient = undefined;
    this.connectedBuildingId = undefined;
    this.connecting = false;
  }
}