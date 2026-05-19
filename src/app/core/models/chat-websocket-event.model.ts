import { ChatMessage } from './chat-message.model';

export interface ChatWebSocketEvent {
  type: 'MESSAGE_CREATED' | 'MESSAGE_DELETED' | 'REACTION_UPDATED';
  buildingId: string;
  message: ChatMessage;
}