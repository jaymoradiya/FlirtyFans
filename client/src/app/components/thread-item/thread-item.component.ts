import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThreadUser } from 'src/app/models/thread-user.model';
import { Thread } from 'src/app/models/thread.model';

@Component({
  selector: 'app-thread-item',
  templateUrl: './thread-item.component.html',
  styleUrls: ['./thread-item.component.css'],
})
export class ThreadItemComponent implements OnInit {
  @Input()
  thread: Thread | undefined;

  threadUser: ThreadUser | undefined;

  @Input()
  selected = false;

  constructor() {}
  ngOnInit(): void {
    this.threadUser = {
      photoUrl:
        this.thread?.otherUserId == this.thread?.lastMessage.senderId
          ? this.thread!.lastMessage.senderUserPhotoUrl
          : this.thread!.lastMessage.recipientUserPhotoUrl,
      knownAs:
        this.thread?.otherUserId == this.thread?.lastMessage.senderId
          ? this.thread!.lastMessage.senderKnownAs
          : this.thread!.lastMessage.recipientKnownAs,
      id: this.thread!.otherUserId,
      lastMessage: this.thread!.lastMessage,
    };
  }
}
