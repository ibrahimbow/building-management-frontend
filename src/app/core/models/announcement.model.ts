export type AnnouncementCategory =
  | 'GENERAL'
  | 'MAINTENANCE'
  | 'EMERGENCY'
  | 'EVENT'
  | 'REMINDER'
  | 'SAFETY';

export interface Announcement {
  id: string;
  buildingId: string;
  title: string;
  message: string;
  category: AnnouncementCategory;
  icon: string;
  imageUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  category: AnnouncementCategory;
  imageUrl?: string | null;
}

export interface UpdateAnnouncementRequest {
  title: string;
  message: string;
  category: AnnouncementCategory;
  imageUrl?: string | null;
}