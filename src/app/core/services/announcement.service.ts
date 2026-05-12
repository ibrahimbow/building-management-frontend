import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest
} from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api';

  createAnnouncement(request: CreateAnnouncementRequest): Observable<Announcement> {
    return this.http.post<Announcement>(
      `${this.apiUrl}/manager/announcements`,
      request
    );
  }

  getManagerAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      `${this.apiUrl}/manager/announcements`
    );
  }

  getTenantAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      `${this.apiUrl}/tenant/announcements`
    );
  }

  deleteAnnouncement(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/manager/announcements/${id}`
    );
  }

  getAnnouncementById(id: string): Observable<Announcement> {
  return this.http.get<Announcement>(
    `${this.apiUrl}/manager/announcements/${id}`
  );
}

updateAnnouncement(
  id: string,
  request: UpdateAnnouncementRequest
): Observable<Announcement> {
  return this.http.put<Announcement>(
    `${this.apiUrl}/manager/announcements/${id}`,
    request
  );
}

}