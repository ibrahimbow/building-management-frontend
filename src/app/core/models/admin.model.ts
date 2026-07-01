import { Announcement } from './announcement.model';
import { ChatMessage } from './chat-message.model';
import { ShareAndHelp } from './share-and-help.model';

export type AdminAnnouncement = Announcement;

export type AdminChatMessage = ChatMessage;

export type AdminShareAndHelpPost = ShareAndHelp;

export interface AdminModerationDeleteResult {
  deleted: boolean;
}

export interface AdminAuditEvent {
  id: string;
  userId: number;
  username: string;
  eventType: string;
  description: string;
  createdAt: string;
}