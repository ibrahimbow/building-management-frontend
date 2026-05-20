import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUrlService {

  private readonly apiUrl =
    'http://localhost:8080';

  resolve(url: string | null | undefined): string {

    if (!url) {
      return '';
    }

    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${this.apiUrl}${url}`;
    }

    return `${this.apiUrl}/${url}`;
  }

  hasImage(url: string | null | undefined): boolean {

    return !!url && url.trim().length > 0;
  }
}