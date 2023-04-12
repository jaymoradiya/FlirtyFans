import { Message } from './message.model';

export interface ThreadUser {
  knownAs: string;
  photoUrl: string;
  id: number;
  lastMessage: Message;
}
