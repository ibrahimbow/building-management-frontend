import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ShareAndHelp,
  ShareAndHelpComment
} from '../models/share-and-help';

@Injectable({
  providedIn: 'root'
})
export class ShareAndHelpService {
  private readonly STORAGE_KEY = 'bm_share_and_help';

  private subject = new BehaviorSubject<ShareAndHelp[]>(this.load());

  posts$ = this.subject.asObservable();

  add(post: ShareAndHelp): void {
    const updated = [post, ...this.subject.value];
    this.update(updated);
  }

  delete(id: string): void {
    const updated = this.subject.value.filter(post => post.id !== id);
    this.update(updated);
  }

  addComment(postId: string, comment: ShareAndHelpComment): void {
    const updated = this.subject.value.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [...(post.comments ?? []), comment]
          }
        : post
    );

    this.update(updated);
  }

  deleteComment(postId: string, commentId: string): void {
    const updated = this.subject.value.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          }
        : post
    );

    this.update(updated);
  }

  private update(posts: ShareAndHelp[]): void {
    this.subject.next(posts);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
  }

  private load(): ShareAndHelp[] {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      return [];
    }

    const posts = JSON.parse(data) as ShareAndHelp[];

    return posts.map(post => ({
      ...post,
      comments: post.comments ?? []
    }));
  }
}