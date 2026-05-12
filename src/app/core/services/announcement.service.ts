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
  private readonly managerAnnouncementsUrl = `${this.apiUrl}/manager/announcements`;
  private readonly tenantAnnouncementsUrl = `${this.apiUrl}/tenant/announcements`;

  createAnnouncement(
    request: CreateAnnouncementRequest
  ): Observable<Announcement> {
    return this.http.post<Announcement>(
      this.managerAnnouncementsUrl,
      request
    );
  }

  getManagerAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      this.managerAnnouncementsUrl
    );
  }

  getAnnouncementById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(
      `${this.managerAnnouncementsUrl}/${id}`
    );
  }

  updateAnnouncement(
    id: string,
    request: UpdateAnnouncementRequest
  ): Observable<Announcement> {
    return this.http.put<Announcement>(
      `${this.managerAnnouncementsUrl}/${id}`,
      request
    );
  }

  deleteAnnouncement(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.managerAnnouncementsUrl}/${id}`
    );
  }

  getTenantAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      this.tenantAnnouncementsUrl
    );
  }
}