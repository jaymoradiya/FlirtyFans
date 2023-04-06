export interface Message {
  id: number;
  senderId: number;
  senderKnownAs: string;
  senderUserPhotoUrl: string;
  recipientId: number;
  recipientKnownAs: string;
  recipientUserPhotoUrl: string;
  content: string;
  dateRead: Date;
  dateSent: Date;
}
