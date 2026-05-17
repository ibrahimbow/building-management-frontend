import { ChatReactionSummary } from './chat-reaction-summary.model';

export interface ChatMessage {
  id: string;
  senderUserId: number;
  senderDisplayName: string;
  senderAvatarUrl?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  reactions: ChatReactionSummary[];
}