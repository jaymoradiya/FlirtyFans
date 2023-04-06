import { Message } from './message.model';

export interface Thread {
  userId: number;
  otherUserId: number;
  lastMessage: Message;
}
