export type AnnouncementCategory =
    | 'Maintenance'
    | 'Safety'
    | 'Reminder';

export interface Announcement {
    id: string;
    title: string;
    message: string;
    category: AnnouncementCategory;
    createdAt: string;
    updatedAt?: string;
    icon?: string; // optional 
    images?: string[]; // optional (backend may not send)
    createdBy?: string;
}
