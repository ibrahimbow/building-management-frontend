import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateShareAndHelpCommentRequest,
  CreateShareAndHelpRequest,
  ShareAndHelp,
  UpdateShareAndHelpRequest
} from '../models/share-and-help';

@Injectable({
  providedIn: 'root'
})
export class ShareAndHelpService {

  private readonly apiUrl = 'http://localhost:8080/api/tenant/share-and-help/posts';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ShareAndHelp[]> {
    return this.http.get<ShareAndHelp[]>(this.apiUrl);
  }

  create(request: CreateShareAndHelpRequest): Observable<ShareAndHelp> {
    return this.http.post<ShareAndHelp>(this.apiUrl, request);
  }

  update(
    postId: string,
    request: UpdateShareAndHelpRequest
  ): Observable<ShareAndHelp> {
    return this.http.put<ShareAndHelp>(`${this.apiUrl}/${postId}`, request);
  }

  delete(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  addComment(
    postId: string,
    request: CreateShareAndHelpCommentRequest
  ): Observable<ShareAndHelp> {
    return this.http.post<ShareAndHelp>(
      `${this.apiUrl}/${postId}/comments`,
      request
    );
  }

  deleteComment(
    postId: string,
    commentId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${postId}/comments/${commentId}`
    );
  }
}