import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  AdminAnnouncement,
  AdminChatMessage,
  AdminShareAndHelpPost
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiBaseUrl}/admin`;

  getAnnouncements(): Observable<AdminAnnouncement[]> {
    return this.http.get<AdminAnnouncement[]>(
      `${this.apiUrl}/announcements`
    );
  }

  deleteAnnouncement(
    announcementId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/announcements/${announcementId}`
    );
  }

  getShareAndHelpPosts(): Observable<AdminShareAndHelpPost[]> {
    return this.http.get<AdminShareAndHelpPost[]>(
      `${this.apiUrl}/share-and-help/posts`
    );
  }

  deleteShareAndHelpPost(
    postId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/share-and-help/posts/${postId}`
    );
  }

  deleteShareAndHelpComment(
    postId: string,
    commentId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/share-and-help/posts/${postId}/comments/${commentId}`
    );
  }

  getChatMessages(): Observable<AdminChatMessage[]> {
    return this.http.get<AdminChatMessage[]>(
      `${this.apiUrl}/chat/messages`
    );
  }

  deleteChatMessage(
    messageId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/chat/messages/${messageId}`
    );
  }
}