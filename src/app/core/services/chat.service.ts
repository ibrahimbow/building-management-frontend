import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatMessage } from '../models/chat-message.model';
import { ChatReaction } from '../models/chat-reaction.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8080/api/tenant/chat';

  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/messages`);
  }

  sendMessage(content: string | null, imageUrl: string | null): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.baseUrl}/messages`, {
      content,
      imageUrl
    });
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/messages/${messageId}`);
  }

  reactToMessage(messageId: string, emoji: string): Observable<ChatReaction> {
    return this.http.post<ChatReaction>(`${this.baseUrl}/messages/${messageId}/reactions`, {
      emoji
    });
  }

  removeReaction(messageId: string, emoji: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`
    );
  }
}