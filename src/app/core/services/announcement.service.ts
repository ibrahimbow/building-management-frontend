import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Announcement } from '../models/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private readonly STORAGE_KEY = 'bm_announcements';

  private readonly defaultAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Water Maintenance',
      message: 'Water supply maintenance is scheduled...',
      category: 'Maintenance',
      createdAt: '2026-05-20T09:00:00Z',
      icon: 'build',
      images: ['assets/images/water-maintenance.jpg']
    }
  ];

  private readonly announcementsSubject =
    new BehaviorSubject<Announcement[]>(this.loadAnnouncements());

  readonly announcements$ = this.announcementsSubject.asObservable();

  getAnnouncements(): Announcement[] {
    return this.announcementsSubject.value;
  }

  addAnnouncement(announcement: Announcement): void {
    const updated = [
      announcement,
      ...this.announcementsSubject.value
    ];

    this.updateState(updated);
  }

  deleteAnnouncement(id: string): void {
    const updated = this.announcementsSubject.value.filter(a => a.id !== id);
    this.updateState(updated);
  }

  updateAnnouncement(updatedAnnouncement: Announcement): void {
    const updated = this.announcementsSubject.value.map(a =>
      a.id === updatedAnnouncement.id ? updatedAnnouncement : a
    );

    this.updateState(updated);
  }

  private updateState(announcements: Announcement[]): void {
    this.announcementsSubject.next(announcements);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(announcements));
  }

  private loadAnnouncements(): Announcement[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (!saved) {
      return this.defaultAnnouncements;
    }

    return JSON.parse(saved);
  }
}