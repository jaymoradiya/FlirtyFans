import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Pagination } from 'src/app/models/pagination.model';
import { Thread } from 'src/app/models/thread.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export default class MessagesComponent implements OnInit {
  selectedThreadUser:
    | {
        id: number;
        photoUrl: string;
        knownAs: string;
      }
    | undefined;
  threads?: Thread[];
  user?: User;
  content: string = '';
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 40;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads() {
    this.messageService.getThreads().subscribe({
      next: (res) => {
        this.threads = res.data;
        if (this.threads.length > 0) this.selectThread(this.threads[0]);
      },
    });
  }

  getOtherUserDetails(thread: Thread) {
    var users = [
      {
        id: thread.lastMessage.senderId,
        photoUrl: thread.lastMessage.senderUserPhotoUrl,
        knownAs: thread.lastMessage.senderKnownAs,
      },
      {
        id: thread.lastMessage.recipientId,
        photoUrl: thread.lastMessage.recipientUserPhotoUrl,
        knownAs: thread.lastMessage.recipientKnownAs,
      },
    ];
    return users.find((u) => u.id === thread.otherUserId)!;
  }

  selectThread(thread: Thread) {
    this.selectedThreadUser = this.getOtherUserDetails(thread);
    console.log('from parent', this.selectedThreadUser);
  }
}
